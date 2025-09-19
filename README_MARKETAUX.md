# 🚀 Siddhant's Trading Assistant with Marketaux Integration

A powerful FastAPI service that provides **real-time news and market sentiment analysis** using the Marketaux API, replacing the previous Alpha Vantage MCP integration.

## 🔑 API Integration

**Marketaux API Token:** `TpRLSwr0gbIZGDjeiqWLQ5jc2uf6MObqRsH8r5Xu`

The system now uses Marketaux API which provides:
- ✅ **Higher rate limits** than Alpha Vantage free tier
- ✅ **Real-time news** for any stock symbol
- ✅ **Sentiment analysis** built into the API
- ✅ **Global market coverage** (US, India, and more)
- ✅ **News search** by keywords

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Create virtual environment
python3 -m venv .venv && source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Run the Server

```bash
# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

### 3. Test the Integration

```bash
# Test Marketaux integration
python test_marketaux.py

# Or run demo mode
python test_marketaux.py
```

## 📊 New API Endpoints

### 🗞️ News Endpoints

#### Get News for Any Symbol
```bash
# Get AAPL news
curl "http://localhost:8000/api/news?symbol=AAPL&limit=10"

# Get general market news
curl "http://localhost:8000/api/news?limit=20"
```

#### Search News by Keywords
```bash
# Search for Tesla news
curl "http://localhost:8000/api/news/search?query=Tesla&limit=15"

# Search for AI/tech news
curl "http://localhost:8000/api/news/search?query=artificial%20intelligence&limit=10"
```

#### Get News for Specific Symbol (Alternative)
```bash
# Alternative endpoint format
curl "http://localhost:8000/api/news/symbols/TSLA?limit=10"
```

### 📈 Sentiment Analysis

#### Get News Sentiment for Symbol
```bash
# Analyze TSLA sentiment
curl "http://localhost:8000/api/news/sentiment/TSLA?limit=50"
```

**Response includes:**
- Overall sentiment (bullish/bearish/neutral)
- Sentiment score (-1 to 1)
- Distribution breakdown (positive/negative/neutral %)
- Average relevance score
- Recent articles with sentiment

### 🔄 Real-time Streaming

#### Stream News Updates
```bash
# Stream AAPL news updates every 60 seconds
curl -N "http://localhost:8000/api/news/stream?symbol=AAPL&interval=60"

# Stream general market news
curl -N "http://localhost:8000/api/news/stream?interval=120"
```

## 📋 Response Format

### News Response Structure
```json
{
  "symbol": "AAPL",
  "summary": "📰 Latest News for AAPL:\n\n1. 🟢 Apple Reports Strong Q4 Earnings...",
  "articles": [
    {
      "title": "Apple Reports Strong Q4 Earnings Beat",
      "description": "Apple Inc. reported quarterly earnings that exceeded...",
      "url": "https://example.com/news/apple-earnings",
      "published_at": "2024-01-18T15:30:00Z",
      "source": "Reuters",
      "sentiment": "positive",
      "symbols": ["AAPL"],
      "relevance_score": 8.5
    }
  ],
  "total": 10,
  "meta": {...}
}
```

### Sentiment Analysis Response
```json
{
  "symbol": "TSLA",
  "overall_sentiment": "bullish",
  "sentiment_score": 0.35,
  "sentiment_distribution": {
    "positive": 15,
    "negative": 5,
    "neutral": 10
  },
  "average_relevance": 7.2,
  "total_articles": 30,
  "summary": "📊 News Sentiment Analysis for TSLA\n\n🐂 Overall Sentiment: Bullish...",
  "recent_articles": [...]
}
```

## 🎯 Key Features

### 🔍 Smart News Processing
- **Symbol extraction** from articles
- **Sentiment classification** (positive/negative/neutral)
- **Relevance scoring** (0-10 scale)
- **Source tracking** and credibility
- **Timestamp normalization**

### 📊 Sentiment Analysis
- **Overall sentiment** calculation
- **Distribution analysis** (% breakdown)
- **Sentiment scoring** (-1 to 1 scale)
- **Trend identification** (bullish/bearish/neutral)

### ⚡ Performance Optimizations
- **Async HTTP client** with connection pooling
- **Rate limit respect** (30s minimum between requests)
- **Error handling** with graceful fallbacks
- **Resource cleanup** on shutdown

### 🌍 Global Coverage
- **US Markets** (NASDAQ, NYSE)
- **Indian Markets** (BSE, NSE) 
- **International** markets support
- **Multi-language** news (English default)

## 🧪 Testing

### Run Full Test Suite
```bash
python test_marketaux.py
```

**Tests include:**
- ✅ General market news fetching
- ✅ Symbol-specific news retrieval
- ✅ News search functionality
- ✅ Sentiment analysis accuracy
- ✅ API response structure validation
- ✅ Error handling verification

### Sample Test Output
```
🧪 Testing Marketaux API Integration...
============================================================

📰 Test 1: General Market News
----------------------------------------
✅ Found 5 articles
📰 Latest Market News:

1. 🟢 Stock Market Hits New Highs Amid Strong Earnings...
   📅 15:30 | 📰 Reuters

2. ⚪ Federal Reserve Maintains Interest Rates...
   📅 14:45 | 📰 Bloomberg
```

## 🔧 Configuration

### Environment Variables (Optional)
```bash
# Custom API token (already configured)
export MARKETAUX_API_TOKEN="your_token_here"

# Custom base URL (if needed)
export MARKETAUX_BASE_URL="https://api.marketaux.com/v1"
```

### Rate Limiting
- **Default:** 30 seconds minimum between requests
- **Streaming:** 60 seconds minimum interval
- **Burst protection:** Built-in retry logic

## 🚀 Integration with Trading Assistant

The Marketaux integration seamlessly works with Siddhant's trading assistant:

```python
# Example: Get news sentiment for trading decisions
sentiment_data = await get_news_sentiment("AAPL", limit=50)

if sentiment_data["overall_sentiment"] == "bullish":
    print("🐂 Positive news sentiment - consider long position")
elif sentiment_data["overall_sentiment"] == "bearish":
    print("🐻 Negative news sentiment - exercise caution")
```

## 📈 Use Cases

### For Day Trading
- **Real-time news** alerts for quick reactions
- **Sentiment shifts** to time entries/exits
- **Breaking news** impact analysis

### For Swing Trading
- **Weekly sentiment** trends
- **Earnings news** analysis
- **Sector rotation** signals

### For Long-term Investing
- **Fundamental news** tracking
- **Management changes** monitoring
- **Industry trend** analysis

## ⚠️ Important Notes

- **Rate Limits:** Marketaux has generous limits, but respect the 30s minimum
- **Data Accuracy:** News sentiment is AI-generated, use as one factor among many
- **Market Hours:** News is available 24/7, but relevance varies by market hours
- **Symbol Format:** Use standard symbols (AAPL, TSLA, etc.) for best results

## 🤝 Support

For issues or questions about the Marketaux integration:
1. Check the test suite output for API connectivity
2. Verify your API token is valid
3. Review rate limiting if getting 429 errors
4. Check symbol format for news requests

---

**Happy Trading with Real-time News Intelligence! 📰📈**