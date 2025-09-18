"""
Marketaux API Integration for News and Market Data
Replaces the previous news.py with Marketaux API integration
"""

from __future__ import annotations

import asyncio
import json
import aiohttp
from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta
import logging

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

logger = logging.getLogger(__name__)

# Your Marketaux API Token
MARKETAUX_API_TOKEN = "TpRLSwr0gbIZGDjeiqWLQ5jc2uf6MObqRsH8r5Xu"
MARKETAUX_BASE_URL = "https://api.marketaux.com/v1"

router = APIRouter()

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
        """
        Get news from Marketaux API
        
        Args:
            symbols: Comma-separated stock symbols (e.g., "AAPL,TSLA")
            countries: Country codes (default: "us,in" for US and India)
            limit: Number of articles (max 100)
            language: Language code (default: "en")
        """
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
    
    async def search_news(self, query: str, limit: int = 20) -> Dict[str, Any]:
        """Search news by keyword"""
        params = {
            "search": query,
            "limit": min(limit, 100),
            "language": "en"
        }
        return await self._make_request("news/all", params)

# Global client instance
marketaux_client = MarketauxClient(MARKETAUX_API_TOKEN)

def _normalize_marketaux_news(data: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize Marketaux news response to consistent format"""
    articles = []
    
    for article in data.get("data", []):
        # Extract sentiment if available
        sentiment = "neutral"
        if article.get("sentiment"):
            sentiment = article["sentiment"]
        
        # Format entities (companies/symbols mentioned)
        entities = []
        if article.get("entities"):
            for entity in article["entities"]:
                if entity.get("symbol"):
                    entities.append({
                        "symbol": entity["symbol"],
                        "name": entity.get("name", ""),
                        "sentiment": entity.get("sentiment", "neutral")
                    })
        
        normalized_article = {
            "title": article.get("title", ""),
            "description": article.get("description", ""),
            "snippet": article.get("snippet", ""),
            "url": article.get("url", ""),
            "image_url": article.get("image_url", ""),
            "published_at": article.get("published_at", ""),
            "source": article.get("source", ""),
            "sentiment": sentiment,
            "entities": entities,
            "symbols": [e.get("symbol") for e in entities if e.get("symbol")],
            "relevance_score": article.get("relevance_score", 0)
        }
        articles.append(normalized_article)
    
    return {
        "articles": articles,
        "total_articles": len(articles),
        "meta": data.get("meta", {}),
        "raw": data
    }

def _create_news_summary(articles: List[Dict[str, Any]], symbol: Optional[str] = None) -> str:
    """Create a friendly summary of news articles"""
    if not articles:
        return "No recent news found."
    
    summary_parts = []
    
    if symbol:
        summary_parts.append(f"📰 **Latest News for {symbol.upper()}:**\n")
    else:
        summary_parts.append("📰 **Latest Market News:**\n")
    
    for i, article in enumerate(articles[:5], 1):
        sentiment_emoji = {
            "positive": "🟢",
            "negative": "🔴", 
            "neutral": "⚪"
        }.get(article.get("sentiment", "neutral"), "⚪")
        
        title = article.get("title", "No title")[:80]
        if len(article.get("title", "")) > 80:
            title += "..."
            
        source = article.get("source", "Unknown")
        published = article.get("published_at", "")
        
        # Format timestamp
        time_str = ""
        if published:
            try:
                dt = datetime.fromisoformat(published.replace('Z', '+00:00'))
                time_str = dt.strftime("%H:%M")
            except:
                time_str = published[:10]  # Just date
        
        summary_parts.append(
            f"{i}. {sentiment_emoji} **{title}**\n"
            f"   📅 {time_str} | 📰 {source}\n"
        )
        
        # Add symbols if available
        symbols = article.get("symbols", [])
        if symbols:
            symbols_str = ", ".join(symbols[:3])  # Max 3 symbols
            summary_parts.append(f"   🏷️ Related: {symbols_str}\n")
        
        summary_parts.append("")  # Empty line
    
    return "\n".join(summary_parts)

@router.get("/news")
async def get_news(symbol: Optional[str] = None, limit: int = 20):
    """
    Get news articles, optionally filtered by symbol
    
    Args:
        symbol: Stock symbol to filter news (optional)
        limit: Number of articles to return (max 100)
    """
    try:
        if symbol:
            data = await marketaux_client.get_stock_news(symbol, limit)
        else:
            data = await marketaux_client.get_market_news(limit)
        
        normalized = _normalize_marketaux_news(data)
        summary = _create_news_summary(normalized["articles"], symbol)
        
        return {
            "symbol": symbol,
            "summary": summary,
            "articles": normalized["articles"],
            "total": normalized["total_articles"],
            "meta": normalized["meta"]
        }
        
    except Exception as e:
        logger.error(f"Error fetching news: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/news/search")
async def search_news(query: str, limit: int = 20):
    """
    Search news articles by keyword
    
    Args:
        query: Search term
        limit: Number of articles to return
    """
    try:
        data = await marketaux_client.search_news(query, limit)
        normalized = _normalize_marketaux_news(data)
        summary = _create_news_summary(normalized["articles"])
        
        return {
            "query": query,
            "summary": summary,
            "articles": normalized["articles"],
            "total": normalized["total_articles"],
            "meta": normalized["meta"]
        }
        
    except Exception as e:
        logger.error(f"Error searching news: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/news/stream")
async def news_stream(symbol: Optional[str] = None, interval: float = 60.0) -> StreamingResponse:
    """
    Stream news updates for a symbol or general market news
    
    Args:
        symbol: Stock symbol to monitor (optional)
        interval: Update interval in seconds (minimum 30s to respect rate limits)
    """
    
    async def generate_news_stream():
        while True:
            try:
                if symbol:
                    data = await marketaux_client.get_stock_news(symbol, 10)
                else:
                    data = await marketaux_client.get_market_news(20)
                
                normalized = _normalize_marketaux_news(data)
                summary = _create_news_summary(normalized["articles"], symbol)
                
                stream_data = {
                    "timestamp": datetime.now().isoformat(),
                    "symbol": symbol,
                    "summary": summary,
                    "articles": normalized["articles"][:5],  # Limit for streaming
                    "total": normalized["total_articles"]
                }
                
                yield f"data: {json.dumps(stream_data)}\n\n"
                
            except Exception as e:
                error_data = {
                    "timestamp": datetime.now().isoformat(),
                    "error": str(e),
                    "symbol": symbol
                }
                yield f"data: {json.dumps(error_data)}\n\n"
            
            # Respect rate limits - minimum 30 seconds between requests
            await asyncio.sleep(max(30.0, interval))
    
    return StreamingResponse(
        generate_news_stream(), 
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )

@router.get("/news/symbols/{symbol}")
async def get_symbol_news(symbol: str, limit: int = 20):
    """
    Get news for a specific symbol (alternative endpoint)
    
    Args:
        symbol: Stock symbol (e.g., AAPL, TSLA)
        limit: Number of articles to return
    """
    return await get_news(symbol=symbol, limit=limit)

@router.get("/news/sentiment/{symbol}")
async def get_news_sentiment(symbol: str, limit: int = 50):
    """
    Get news sentiment analysis for a symbol
    
    Args:
        symbol: Stock symbol
        limit: Number of articles to analyze
    """
    try:
        data = await marketaux_client.get_stock_news(symbol, limit)
        normalized = _normalize_marketaux_news(data)
        
        # Analyze sentiment distribution
        sentiment_counts = {"positive": 0, "negative": 0, "neutral": 0}
        total_relevance = 0
        
        for article in normalized["articles"]:
            sentiment = article.get("sentiment", "neutral")
            sentiment_counts[sentiment] += 1
            relevance = article.get("relevance_score") or 0
            total_relevance += relevance
        
        total_articles = len(normalized["articles"])
        avg_relevance = total_relevance / total_articles if total_articles > 0 else 0
        
        # Calculate sentiment score (-1 to 1)
        if total_articles > 0:
            sentiment_score = (
                (sentiment_counts["positive"] - sentiment_counts["negative"]) / total_articles
            )
        else:
            sentiment_score = 0
        
        # Determine overall sentiment
        if sentiment_score > 0.2:
            overall_sentiment = "bullish"
            sentiment_emoji = "🐂"
        elif sentiment_score < -0.2:
            overall_sentiment = "bearish"
            sentiment_emoji = "🐻"
        else:
            overall_sentiment = "neutral"
            sentiment_emoji = "⚪"
        
        summary = f"""
📊 **News Sentiment Analysis for {symbol.upper()}**

{sentiment_emoji} **Overall Sentiment:** {overall_sentiment.title()} (Score: {sentiment_score:.2f})

📈 **Breakdown:**
• 🟢 Positive: {sentiment_counts['positive']} articles ({sentiment_counts['positive']/total_articles*100:.1f}%)
• 🔴 Negative: {sentiment_counts['negative']} articles ({sentiment_counts['negative']/total_articles*100:.1f}%)
• ⚪ Neutral: {sentiment_counts['neutral']} articles ({sentiment_counts['neutral']/total_articles*100:.1f}%)

📊 **Average Relevance:** {avg_relevance:.2f}/10
📰 **Total Articles Analyzed:** {total_articles}
        """.strip()
        
        return {
            "symbol": symbol.upper(),
            "overall_sentiment": overall_sentiment,
            "sentiment_score": sentiment_score,
            "sentiment_distribution": sentiment_counts,
            "average_relevance": avg_relevance,
            "total_articles": total_articles,
            "summary": summary,
            "recent_articles": normalized["articles"][:5]
        }
        
    except Exception as e:
        logger.error(f"Error analyzing sentiment for {symbol}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Cleanup function for app shutdown
async def cleanup_marketaux():
    """Cleanup function to close aiohttp session"""
    await marketaux_client.close()