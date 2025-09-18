from __future__ import annotations

import asyncio
import json
from typing import Any, Dict

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

router = APIRouter()


def _normalize_news_payload(parsed: Any) -> Dict[str, Any]:
    if not isinstance(parsed, dict):
        return {"articles": [], "raw": parsed}
    articles = []
    for a in parsed.get("feed", []) or parsed.get("data", []):
        articles.append(
            {
                "title": a.get("title"),
                "url": a.get("url"),
                "time_published": a.get("time_published") or a.get("published_at"),
                "source": a.get("source") or a.get("source_domain"),
                "summary": a.get("summary") or a.get("snippet"),
                "ticker_sentiment": a.get("ticker_sentiment"),
            }
        )
    return {"articles": articles, "raw": parsed}


@router.get("/news")
async def news(symbol: str, limit: int = 20):
    tool = "NEWS_SENTIMENT"
    params = {"tickers": symbol.upper(), "limit": max(1, min(limit, 100))}
    # The app's MCP client is stored on app.state.mcp
    # FastAPI injects the request via dependency; we can access router.app via request.app
    # But simpler: we rely on the global app state via 'router' context using a closure in main include.
    # Here, we access the Starlette app via router, provided by FastAPI at runtime.
    app = router.routes[0].app  # type: ignore[attr-defined]
    res = await app.state.mcp.call_tool(tool, params)
    # Parse text content if needed
    if isinstance(res, dict) and isinstance(res.get("content"), list):
        try:
            for item in res["content"]:
                if item.get("type") == "text":
                    parsed = json.loads(item.get("text", "{}"))
                    return {"tool": tool, "params": params, "result": _normalize_news_payload(parsed)}
        except Exception:
            pass
    return {"tool": tool, "params": params, "result": _normalize_news_payload(res)}


@router.get("/news/stream")
async def news_stream(symbol: str, interval: float = 30.0) -> StreamingResponse:
    tool = "NEWS_SENTIMENT"
    params = {"tickers": symbol.upper(), "limit": 20}

    async def gen():
        # Access app instance from router context
        app = router.routes[0].app  # type: ignore[attr-defined]
        while True:
            try:
                res = await app.state.mcp.call_tool(tool, params)
                if isinstance(res, dict) and isinstance(res.get("content"), list):
                    try:
                        for item in res["content"]:
                            if item.get("type") == "text":
                                res = json.loads(item.get("text", "{}"))
                                break
                    except Exception:
                        pass
                data = json.dumps({"tool": tool, "params": params, "result": _normalize_news_payload(res)})
                yield f"data: {data}\n\n"
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
            await asyncio.sleep(max(5.0, interval))

    return StreamingResponse(gen(), media_type="text/event-stream")


