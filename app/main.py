from __future__ import annotations

import os
import re
import json
from typing import Any, Dict, Optional, List
import asyncio

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse, HTMLResponse
from pydantic import BaseModel
from dotenv import load_dotenv

ALPHA_VANTAGE_MCP_URL_ENV = "ALPHA_VANTAGE_MCP_URL"


class QueryRequest(BaseModel):
    message: str


class MCPClient:
    """Minimal JSON-RPC over HTTP client for Alpha Vantage MCP server.

    The official MCP server supports HTTP JSON-RPC at the connection URL. We call tools
    by POSTing a JSON-RPC request with method 'tools.call' and tool-specific params.
    """

    def __init__(self, base_url: str, client: Optional[httpx.AsyncClient] = None) -> None:
        self.base_url = base_url.rstrip("/")
        self.client = client or httpx.AsyncClient(timeout=30)
        self._id_counter = 0

    def _next_id(self) -> int:
        self._id_counter += 1
        return self._id_counter

    async def call_tool(self, tool: str, params: Dict[str, Any]) -> Any:
        payload = {
            "jsonrpc": "2.0",
            "id": self._next_id(),
            "method": "tools/call",
            "params": {"name": tool, "arguments": params},
        }
        resp = await self.client.post(self.base_url, json=payload)
        if resp.status_code >= 400:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
        data = resp.json()
        if "error" in data:
            raise HTTPException(status_code=502, detail=data["error"])
        return data.get("result")


def pick_tool_for_message(text: str) -> tuple[str, Dict[str, Any]]:
    t = text.lower().strip()

    # Top gainers/losers/most active
    if (
        "top" in t
        or "top performers" in t
        or "top performance" in t
        or "gainers" in t
        or "most active" in t
        or "growing" in t
    ):
        return "TOP_GAINERS_LOSERS", {}

    # Quote for a ticker like: quote AAPL
    m = re.search(r"quote\s+([A-Za-z\.\-]{1,10})", t)
    if m:
        return "GLOBAL_QUOTE", {"symbol": m.group(1).upper()}

    # News for ticker
    m = re.search(r"news\s+([A-Za-z\.\-]{1,10})", t)
    if m:
        return "NEWS_SENTIMENT", {"tickers": m.group(1).upper(), "limit": 20}

    # Search symbol
    m = re.search(r"search\s+(.+)$", t)
    if m:
        return "SYMBOL_SEARCH", {"keywords": m.group(1)}

    # Technicals: rsi AAPL daily 14
    m = re.search(r"rsi\s+([A-Za-z\.\-]{1,10})(?:\s+(1min|5min|15min|30min|60min|daily|weekly|monthly))?(?:\s+(\d{1,3}))?", t)
    if m:
        symbol = m.group(1).upper()
        interval = m.group(2) or "daily"
        period = int(m.group(3) or 14)
        return "RSI", {"symbol": symbol, "interval": interval, "time_period": period, "series_type": "close"}

    # Fallback: try market status
    if "market status" in t or "status" in t:
        return "MARKET_STATUS", {}

    # Final fallback: treat as top gainers to emulate example behavior
    return "TOP_GAINERS_LOSERS", {}


def _maybe_parse_text_payload(result: Any) -> Any:
    # Alpha MCP often returns { content: [ { type: 'text', text: '...json...' } ] }
    try:
        if isinstance(result, dict) and isinstance(result.get("content"), list):
            for item in result["content"]:
                if item.get("type") == "text" and isinstance(item.get("text"), str):
                    return json.loads(item["text"])  # may raise
    except Exception:
        return result
    return result


def _format_table(rows: List[Dict[str, Any]], title: str, cols: List[str]) -> str:
    if not rows:
        return f"### {title}\nNo data."
    header = " | ".join(cols)
    sep = " | ".join(["---"] * len(cols))
    lines = [f"### {title}", f"{header}", f"{sep}"]
    for r in rows:
        values = []
        for c in cols:
            v = r.get(c)
            values.append(str(v) if v is not None else "")
        lines.append(" | ".join(values))
    return "\n".join(lines)


def summarize_result(tool: str, result: Any) -> Any:
    parsed = _maybe_parse_text_payload(result)

    if tool == "TOP_GAINERS_LOSERS" and isinstance(parsed, dict):
        gainers = parsed.get("top_gainers", [])[:10]
        losers = parsed.get("top_losers", [])[:10]
        active = parsed.get("most_actively_traded", [])[:10]

        # Normalize keys to consistent set
        def normalize(rs: List[Dict[str, Any]]):
            out = []
            for r in rs:
                out.append(
                    {
                        "ticker": r.get("ticker"),
                        "price": r.get("price"),
                        "change_%": r.get("change_percentage"),
                        "change": r.get("change_amount"),
                        "volume": r.get("volume"),
                    }
                )
            return out

        gtab = _format_table(normalize(gainers), "Top Gainers", ["ticker", "price", "change_%", "change", "volume"])
        ltab = _format_table(normalize(losers), "Top Losers", ["ticker", "price", "change_%", "change", "volume"])
        atab = _format_table(normalize(active), "Most Active", ["ticker", "price", "change_%", "change", "volume"])

        md = "\n\n".join([gtab, ltab, atab])
        return {"raw": parsed, "markdown": md, "last_updated": parsed.get("last_updated")}

    return parsed


def create_app() -> FastAPI:
    app = FastAPI(title="Alpha Vantage MCP Proxy", version="0.1.0")

    @app.on_event("startup")
    async def _startup() -> None:
        # Load environment variables from a local .env file if present
        load_dotenv()
        url = os.getenv(ALPHA_VANTAGE_MCP_URL_ENV)
        if not url:
            raise RuntimeError(f"Set {ALPHA_VANTAGE_MCP_URL_ENV} to the MCP connection URL")
        app.state.http = httpx.AsyncClient(timeout=30)
        app.state.mcp = MCPClient(url, client=app.state.http)

    @app.on_event("shutdown")
    async def _shutdown() -> None:
        client: httpx.AsyncClient = app.state.http
        await client.aclose()

    @app.post("/query")
    async def query(req: QueryRequest) -> Dict[str, Any]:
        tool, params = pick_tool_for_message(req.message)
        result = await app.state.mcp.call_tool(tool, params)
        return {
            "tool": tool,
            "params": params,
            "result": summarize_result(tool, result),
        }

    @app.get("/stream")
    async def stream(message: str, interval: float = 15.0) -> StreamingResponse:
        tool, params = pick_tool_for_message(message)

        async def event_gen():
            while True:
                try:
                    res = await app.state.mcp.call_tool(tool, params)
                    summarized = summarize_result(tool, res)
                    data = json.dumps({"tool": tool, "params": params, "result": summarized})
                    yield f"data: {data}\n\n"
                except Exception as e:
                    yield f"data: {json.dumps({'error': str(e)})}\n\n"
                await asyncio.sleep(max(3.0, interval))

        return StreamingResponse(event_gen(), media_type="text/event-stream")

    @app.get("/ui")
    async def ui() -> HTMLResponse:
        html = """
<!DOCTYPE html>
<html>
  <head>
    <meta charset=\"utf-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
    <title>Alpha Vantage MCP Tester</title>
    <script src=\"https://cdn.jsdelivr.net/npm/marked/marked.min.js\"></script>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; margin: 24px; }
      .row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
      input[type=text] { width: 360px; padding: 8px; }
      button { padding: 8px 12px; cursor: pointer; }
      pre { background: #111; color: #f5f5f5; padding: 12px; overflow: auto; }
      #md { border: 1px solid #ddd; padding: 12px; border-radius: 6px; }
      .muted { color: #666; font-size: 12px; }
    </style>
  </head>
  <body>
    <h2>Alpha Vantage MCP Tester</h2>
    <div class=\"row\">
      <input id=\"msg\" type=\"text\" value=\"top performers\" />
      <button id=\"send\">Query once</button>
      <button id=\"start\">Start stream</button>
      <button id=\"stop\">Stop stream</button>
      <span class=\"muted\">Tip: try \'quote AAPL\', \'news NVDA\', \'search Microsoft\', \'rsi TSLA daily 14\'</span>
    </div>
    <h3>Markdown</h3>
    <div id=\"md\"></div>
    <h3>JSON</h3>
    <pre id=\"json\"></pre>

    <script>
      const md = document.getElementById('md');
      const jsonEl = document.getElementById('json');
      let es = null;

      function render(data){
        jsonEl.textContent = JSON.stringify(data, null, 2);
        const markdown = data?.result?.markdown || 'No markdown for this tool.';
        md.innerHTML = window.marked.parse(markdown);
      }

      document.getElementById('send').onclick = async () => {
        const message = document.getElementById('msg').value;
        const res = await fetch('/query', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) });
        const data = await res.json();
        render(data);
      };

      document.getElementById('start').onclick = () => {
        const message = encodeURIComponent(document.getElementById('msg').value);
        if (es) es.close();
        es = new EventSource(`/stream?message=${message}&interval=15`);
        es.onmessage = (ev) => {
          try { render(JSON.parse(ev.data)); } catch {}
        };
      };

      document.getElementById('stop').onclick = () => { if (es) { es.close(); es = null; } };
    </script>
  </body>
</html>
"""
        return HTMLResponse(content=html)

    @app.get("/")
    async def root() -> Dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()


