import finnhub
import asyncio
import json
import httpx
import aiohttp
import os
import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

logger = logging.getLogger(__name__)

app = FastAPI(title="Financial Tracker API", version="1.0.0")

# Allow CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup API keys from environment variables
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY", "TpRLSwr0gbIZGDjeiqWLQ5jc2uf6MObqRsH8r5Xu")
MARKETAUX_API_TOKEN = os.getenv("MARKETAUX_API_TOKEN", "TpRLSwr0gbIZGDjeiqWLQ5jc2uf6MObqRsH8r5Xu")
MARKETAUX_BASE_URL = "https://api.marketaux.com/v1"

# Setup clients
finnhub_client = finnhub.Client(api_key=FINNHUB_API_KEY)

class MarketauxClient:
    """Client for Marketaux API"""
    
    def __init__(self, api_token: str):
        self.api_token = api_token
        self.base_url = MARKETAUX_BASE_URL
        self.session = None
        
    async def _get_session(self) -> aiohttp.ClientSession:
        """Get or create aiohttp session"""
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession(
                timeout=aiohttp.ClientTimeout(total=30)
            )
        return self.session
    
    async def close(self):
        """Close the session"""
        if self.session and not self.session.closed:
            await self.session.close()
    
    async def _make_request(self, endpoint: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Make API request to Marketaux"""
        session = await self._get_session()
        
        # Add API token to params
        params["api_token"] = self.api_token
        
        url = f"{self.base_url}/{endpoint}"
        
        try:
            async with session.get(url, params=params) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    logger.error(f"Marketaux API error {response.status}: {error_text}")
                    raise HTTPException(
                        status_code=response.status, 
                        detail=f"Marketaux API error: {error_text}"
                    )
        except aiohttp.ClientError as e:
            logger.error(f"Network error calling Marketaux: {e}")
            raise HTTPException(status_code=503, detail=f"Network error: {str(e)}")
    
    async def get_news(self, symbols: Optional[str] = None, 
                      countries: str = "us,in", 
                      limit: int = 20,
                      language: str = "en") -> Dict[str, Any]:
        """Get news from Marketaux API"""
        params = {
            "countries": countries,
            "limit": min(limit, 100),
            "language": language
        }
        
        if symbols:
            params["symbols"] = symbols.upper()
            
        return await self._make_request("news/all", params)
    
    async def get_stock_news(self, symbol: str, limit: int = 20) -> Dict[str, Any]:
        """Get news specifically for a stock symbol"""
        return await self.get_news(symbols=symbol, limit=limit)
    
    async def get_market_news(self, limit: int = 50) -> Dict[str, Any]:
        """Get general market news"""
        return await self.get_news(limit=limit)

# Initialize Marketaux client
marketaux_client = MarketauxClient(MARKETAUX_API_TOKEN)

class NewsRequest(BaseModel):
    symbol: str
    limit: Optional[int] = 20

def _normalize_news_payload(parsed: Any) -> Dict[str, Any]:
    """Normalize news data from different sources into a consistent format"""
    if not isinstance(parsed, dict):
        return {"articles": [], "raw": parsed}
    
    articles = []
    feed_data = parsed.get("feed", []) or parsed.get("data", []) or parsed.get("articles", [])
    
    for article in feed_data:
        normalized_article = {
            "title": article.get("title", ""),
            "url": article.get("url", ""),
            "time_published": article.get("time_published") or article.get("published_at") or article.get("publishedAt"),
            "source": article.get("source") or article.get("source_domain") or article.get("source_name"),
            "summary": article.get("summary") or article.get("snippet") or article.get("description"),
            "ticker_sentiment": article.get("ticker_sentiment"),
            "image_url": article.get("banner_image") or article.get("urlToImage"),
            "author": article.get("authors") or article.get("author"),
        }
        articles.append(normalized_article)
    
    return {"articles": articles, "total": len(articles), "raw": parsed}

def _normalize_marketaux_payload(data: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize Marketaux news data"""
    if not isinstance(data, dict):
        return {"articles": [], "total": 0}
    
    articles = []
    raw_articles = data.get("data", [])
    
    for article in raw_articles:
        normalized_article = {
            "title": article.get("title", ""),
            "url": article.get("url", ""),
            "time_published": article.get("published_at", ""),
            "source": article.get("source", ""),
            "summary": article.get("snippet", "") or article.get("description", ""),
            "image_url": article.get("image_url", ""),
            "author": article.get("author", ""),
            "entities": article.get("entities", []),
            "keywords": article.get("keywords", []),
            "sentiment": article.get("sentiment", {}),
        }
        articles.append(normalized_article)
    
    return {
        "articles": articles, 
        "total": len(articles),
        "meta": data.get("meta", {})
    }

async def fetch_marketaux_news(symbol: str = None, limit: int = 20) -> Dict[str, Any]:
    """Fetch news from Marketaux API"""
    try:
        if symbol:
            data = await marketaux_client.get_stock_news(symbol, limit)
        else:
            data = await marketaux_client.get_market_news(limit)
        
        return _normalize_marketaux_payload(data)
    except Exception as e:
        logger.error(f"Error fetching Marketaux news: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching news: {str(e)}")

@app.get("/")
def read_root():
    return {"status": "online", "message": "Financial Tracker API is running"}

@app.get("/realtime/{symbol}")
def get_realtime_stock(symbol: str):
    """Get real-time stock data from Finnhub"""
    try:
        # Get real-time quote data
        data = finnhub_client.quote(symbol)
        return {
            "symbol": symbol.upper(),
            "data": {
                "current_price": data["c"],
                "change": data["d"],
                "percent_change": data["dp"],
                "high": data["h"],
                "low": data["l"],
                "open": data["o"],
                "previous_close": data["pc"],
                "timestamp": data["t"]
            }
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/news/{symbol}")
async def get_news(symbol: str, limit: int = 20):
    """Get news for a specific stock symbol using Marketaux"""
    try:
        # Use Marketaux API for news
        return await fetch_marketaux_news(symbol, limit)
        
    except Exception as e:
        # If both APIs fail, return mock data for demonstration
        mock_articles = [
            {
                "title": f"{symbol.upper()} Stock Analysis: Market Update",
                "url": f"https://example.com/{symbol.lower()}-analysis",
                "time_published": datetime.now().isoformat(),
                "source": "Financial Times",
                "summary": f"Latest analysis and market trends for {symbol.upper()} stock.",
                "ticker_sentiment": None,
                "image_url": None,
                "author": "Market Analyst"
            },
            {
                "title": f"Breaking: {symbol.upper()} Quarterly Earnings Report",
                "url": f"https://example.com/{symbol.lower()}-earnings",
                "time_published": datetime.now().isoformat(),
                "source": "Reuters",
                "summary": f"Comprehensive earnings report and financial analysis for {symbol.upper()}.",
                "ticker_sentiment": None,
                "image_url": None,
                "author": "Financial Reporter"
            }
        ]
        
        return {
            "articles": mock_articles,
            "total": len(mock_articles),
            "note": "Using mock data - Please configure Alpha Vantage or NewsAPI keys for real data"
        }

@app.get("/news/{symbol}/stream")
async def get_news_stream(symbol: str, interval: float = 30.0):
    """Stream real-time news updates for a stock symbol"""
    
    async def generate_news_stream():
        while True:
            try:
                # Fetch latest news
                news_data = await get_news(symbol, 10)
                
                # Send as Server-Sent Event
                yield f"data: {json.dumps(news_data)}\n\n"
                
            except Exception as e:
                error_data = {"error": str(e), "timestamp": datetime.now().isoformat()}
                yield f"data: {json.dumps(error_data)}\n\n"
            
            # Wait for the specified interval
            await asyncio.sleep(max(5.0, interval))
    
    return StreamingResponse(
        generate_news_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )

@app.get("/market/general-news")
async def get_general_market_news(limit: int = 50):
    """Get general market news using Marketaux"""
    try:
        # Use Marketaux API for general market news
        return await fetch_marketaux_news(None, limit)
        
        # Mock general market news if no API key
        mock_articles = [
            {
                "title": "Market Opens Higher on Economic Optimism",
                "url": "https://example.com/market-update-1",
                "time_published": datetime.now().isoformat(),
                "source": "MarketWatch",
                "summary": "Major indices opened higher following positive economic indicators.",
                "ticker_sentiment": None,
                "image_url": None,
                "author": "Market Team"
            },
            {
                "title": "Federal Reserve Signals Potential Interest Rate Changes",
                "url": "https://example.com/fed-update",
                "time_published": datetime.now().isoformat(),
                "source": "Bloomberg",
                "summary": "The Federal Reserve indicated potential adjustments to monetary policy.",
                "ticker_sentiment": None,
                "image_url": None,
                "author": "Economic Reporter"
            }
        ]
        
        return {
            "articles": mock_articles,
            "total": len(mock_articles),
            "note": "Using mock data - Please configure Alpha Vantage API key for real data"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching general market news: {str(e)}")

# Startup and shutdown events
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("🚀 Financial Tracker API starting...")
    print("📊 Finnhub client initialized")
    print("📰 Marketaux client initialized")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print("🔄 Shutting down Financial Tracker API...")
    try:
        await marketaux_client.close()
        print("✅ Marketaux client closed")
    except Exception as e:
        print(f"⚠️ Error closing Marketaux client: {e}")

if __name__ == "__main__":
    import uvicorn
    print("🌟 Starting Financial Tracker API on port 8001...")
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=True)