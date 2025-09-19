## Alpha Vantage MCP FastAPI Proxy

This FastAPI service accepts a free-form message, routes it to the Alpha Vantage MCP server, and returns structured results.

### Setup

1. Create a virtualenv (optional) and install deps:
   
   ```bash
   python3 -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. Set environment variable with your MCP URL:

   ```bash
   export ALPHA_VANTAGE_MCP_URL="https://mcp.alphavantage.co/mcp?apikey=YOUR_API_KEY"
   ```

3. Run the server:

   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Usage

Send a message to the POST /query endpoint:

```bash
curl -s -X POST http://localhost:8000/query \
  -H 'Content-Type: application/json' \
  -d '{"message":"top growing stocks"}' | jq
```

Examples supported by the naive intent router:

- "top growing stocks" → `TOP_GAINERS_LOSERS`
- "quote AAPL" → `GLOBAL_QUOTE`
- "news NVDA" → `NEWS_SENTIMENT`
- "search Microsoft" → `SYMBOL_SEARCH`
- "rsi TSLA daily 14" → `RSI`
- "market status" → `MARKET_STATUS`

The response includes the tool name, parameters, and raw result from MCP.

### Markdown tables

When you ask for top performers (e.g., "top performers" or "top growing stocks"), the service parses the MCP payload and returns both the raw JSON and a markdown table bundle for:

- Top Gainers
- Top Losers
- Most Active

The markdown is under `result.markdown` and can be rendered in any chat UI or markdown viewer.

### Streaming updates (SSE)

Open a stream that refreshes every 15s:

```bash
curl -N "http://localhost:8000/stream?message=top%20performers&interval=15"
```

Each event contains `{ tool, params, result }` where `result.markdown` holds the latest tables.

### News by symbol

REST:

```bash
curl -s "http://localhost:8000/news?symbol=TSLA&limit=20" | jq
```

SSE stream:

```bash
curl -N "http://localhost:8000/news/stream?symbol=TSLA&interval=30"
```

The normalized response contains `result.articles` with fields: `title`, `url`, `time_published`, `source`, `summary`, and optional `ticker_sentiment`.

### Notes

- This client uses minimal JSON-RPC over HTTP; no official Alpha Vantage REST API is used—only the MCP server URL you provide.
- You can further expand `pick_tool_for_message` to cover more tools and richer NLU.

