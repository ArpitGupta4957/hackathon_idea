# Enhanced Stock API Features

This document describes the enhanced features added to the trading assistant that leverage the Alpha Vantage MCP stock APIs.

## New Query Patterns

### Historical Performance Analysis
Query past performance of stocks with natural language:

- `past 1 week performance of AAPL` - Gets intraday data for short-term analysis
- `last 2 weeks performance MSFT` - Gets daily data for medium-term analysis  
- `past 3 months performance of GOOGL` - Gets weekly data for longer periods
- `last 1 year performance TSLA` - Gets monthly data for long-term analysis

### Time Series Data
Access different time series with specific intervals:

**Intraday Data:**
- `intraday AAPL` - Default 5-minute intervals
- `intraday MSFT 1min` - 1-minute intervals
- `intraday GOOGL 15min` - 15-minute intervals

**Daily Data:**
- `daily AAPL` - Standard daily OHLCV data
- `daily adjusted MSFT` - Daily data with dividend/split adjustments

**Weekly Data:**
- `weekly GOOGL` - Weekly time series
- `weekly adjusted TSLA` - Weekly data with adjustments

**Monthly Data:**
- `monthly AAPL` - Monthly time series
- `monthly adjusted MSFT` - Monthly data with adjustments

### Bulk Quotes
Get real-time quotes for multiple symbols:
- `quotes AAPL,MSFT,GOOGL` - Multiple symbols separated by commas
- `quote AAPL,TSLA,NVDA` - Up to 100 symbols supported

### Price History & Charts
Alternative ways to request historical data:
- `AAPL price history` - Gets daily price history
- `price history MSFT` - Same as above, different word order
- `chart GOOGL` - Visual-friendly data request
- `TSLA chart` - Alternative chart request format

## Existing Features (Still Supported)

### Basic Quotes & News
- `quote AAPL` - Single stock quote
- `news MSFT` - News sentiment for a ticker
- `search Apple` - Symbol search by company name

### Market Data
- `top gainers` - Top performing stocks
- `top performers` - Same as above
- `most active` - Most actively traded stocks
- `market status` - Current market status worldwide

### Technical Analysis
- `rsi AAPL daily 14` - RSI indicator with custom parameters
- `rsi TSLA weekly 21` - Different timeframe and period

## Response Format

### Time Series Data
Time series responses include:
- **Performance Summary**: Latest price and period change percentage
- **Recent Data Table**: Last 10 data points with OHLCV data
- **Metadata**: Symbol, last refreshed timestamp
- **Raw Data**: Complete API response for further processing

### Bulk Quotes
Bulk quote responses show:
- Symbol, current price, change amount, change percentage, volume
- Formatted as an easy-to-read table
- Support for up to 100 symbols per request

## Usage Examples

### Web UI
Access the web interface at `/ui` and try these queries:
- "past 1 week performance of AAPL"
- "daily adjusted MSFT" 
- "quotes AAPL,MSFT,GOOGL"
- "intraday TSLA 5min"

### API Endpoint
POST to `/query` with JSON body:
```json
{
  "message": "past 1 week performance of AAPL"
}
```

### Streaming
GET `/stream?message=daily%20AAPL&interval=15` for real-time updates every 15 seconds.

## Technical Implementation

The enhanced pattern matching uses regex to identify:
1. **Performance queries** - Extracts time period and maps to appropriate API
2. **Time series requests** - Identifies interval and adjustment preferences  
3. **Bulk operations** - Parses comma-separated symbol lists
4. **Alternative phrasings** - Supports multiple ways to request the same data

The response formatter handles different API response structures and provides:
- Consistent markdown formatting for display
- Performance calculations and summaries
- Structured data for programmatic use
- Error handling for malformed responses

## Supported MCP Tools

The system now leverages these Alpha Vantage MCP tools:
- `TIME_SERIES_INTRADAY` - Current and historical intraday OHLCV
- `TIME_SERIES_DAILY` - Daily time series covering 20+ years
- `TIME_SERIES_DAILY_ADJUSTED` - Daily adjusted OHLCV with splits/dividends
- `TIME_SERIES_WEEKLY` - Weekly time series (last trading day of week)
- `TIME_SERIES_WEEKLY_ADJUSTED` - Weekly adjusted with dividends
- `TIME_SERIES_MONTHLY` - Monthly time series (last trading day of month)
- `TIME_SERIES_MONTHLY_ADJUSTED` - Monthly adjusted with dividends
- `GLOBAL_QUOTE` - Latest price and volume for a ticker
- `REALTIME_BULK_QUOTES` - Real-time quotes for up to 100 symbols
- `SYMBOL_SEARCH` - Search for symbols by keywords
- `MARKET_STATUS` - Current market status worldwide
- `TOP_GAINERS_LOSERS` - Top performers and most active stocks
- `NEWS_SENTIMENT` - News and sentiment analysis
- `RSI` - Relative Strength Index technical indicator