# Financial Tracker - Enhanced Setup Guide

## Project Structure
```
financial-tracker/
├── backend/
│   ├── server.py          # Enhanced FastAPI server with news
│   └── requirements.txt   # Backend dependencies
├── src/
│   ├── components/
│   │   ├── StockChart.js  # Real-time stock price chart
│   │   └── NewsComponent.js # Real-time news component
│   └── pages/
│       └── MainPage.js    # Updated main page with news
└── package.json           # Frontend dependencies
```

## Backend Setup

### 1. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure API Keys

#### Required API Keys:
1. **Finnhub API Key** (for stock data):
   - Go to [https://finnhub.io/](https://finnhub.io/)
   - Sign up for a free account
   - Get your API key from the dashboard
   - Replace `"YOUR_FINNHUB_API_KEY"` in `backend/server.py`

2. **Alpha Vantage API Key** (for news - primary):
   - Go to [https://www.alphavantage.co/](https://www.alphavantage.co/)
   - Sign up for a free account
   - Get your API key
   - Replace `"YOUR_ALPHA_VANTAGE_API_KEY"` in `backend/server.py`

3. **NewsAPI Key** (optional - fallback):
   - Go to [https://newsapi.org/](https://newsapi.org/)
   - Sign up for a free account
   - Get your API key
   - Replace `"YOUR_NEWSAPI_KEY"` in `backend/server.py`

### 3. Start the Backend Server
```bash
cd backend
python server.py
```

The API will be available at `http://localhost:8000`

## Frontend Setup

### 1. Install Dependencies (if not already done)
```bash
npm install react-chartjs-2 chart.js axios
```

### 2. Start the React App
```bash
npm start
```

The app will be available at `http://localhost:3000`

## API Endpoints

### Stock Data:
- `GET /` - Health check
- `GET /realtime/{symbol}` - Real-time stock data (e.g., /realtime/AAPL)

### News Data:
- `GET /news/{symbol}` - News for specific stock (e.g., /news/AAPL)
- `GET /news/{symbol}/stream` - Real-time news stream (Server-Sent Events)
- `GET /market/general-news` - General market news

## Features

### Real-Time Stock Chart:
- Updates every 5 seconds
- Interactive line chart showing price history
- Current price display with change indicators
- Ability to switch between different stock symbols

### Real-Time News:
- **Symbol-specific news**: Shows news related to the selected stock
- **General market news**: Shows broader market and financial news
- Updates every 60 seconds
- Click to open articles in new tab
- Displays source, publication date, and summaries

### Dashboard Features:
- Portfolio statistics cards
- Portfolio allocation pie chart
- Stock symbol input with real-time updates
- Responsive design for different screen sizes

## How It Works

1. **Stock Data Flow**:
   - Frontend sends requests to `/realtime/{symbol}`
   - Backend calls Finnhub API for real-time stock prices
   - Data is normalized and returned to frontend
   - Chart updates automatically every 5 seconds

2. **News Data Flow**:
   - Frontend sends requests to `/news/{symbol}` or `/market/general-news`
   - Backend tries Alpha Vantage API first, then falls back to NewsAPI
   - If both APIs are unavailable, mock data is returned for demonstration
   - News updates automatically every 60 seconds

## Configuration Options

### Stock Chart Refresh Rate:
```javascript
<StockChart symbol="AAPL" refreshInterval={5000} />  // 5 seconds
```

### News Refresh Rate:
```javascript
<NewsComponent symbol="AAPL" refreshInterval={60000} />  // 60 seconds
```

## Troubleshooting

### Backend Issues:
- **CORS errors**: Ensure backend CORS middleware allows your frontend domain
- **API key errors**: Verify all API keys are correctly configured
- **Rate limiting**: Free API plans have request limits - consider upgrading for production

### Frontend Issues:
- **Connection errors**: Ensure backend is running on port 8000
- **Chart not updating**: Check browser console for API errors
- **News not loading**: Verify API keys are configured in backend

## Mock Data Fallback

If API keys are not configured, the system will show mock data to demonstrate functionality:
- Mock stock prices (simulated)
- Sample news articles
- All features remain functional for development and testing

## Production Considerations

1. **Security**: Use environment variables for API keys
2. **Rate Limiting**: Implement rate limiting for your APIs
3. **Caching**: Add Redis caching for frequently requested data
4. **Error Handling**: Enhance error handling and user feedback
5. **Monitoring**: Add logging and monitoring for API calls
6. **CORS**: Restrict CORS origins to your actual frontend domain

## Free Tier Limits

- **Finnhub**: 60 calls/minute
- **Alpha Vantage**: 25 calls/day (news), 500 calls/day (stocks)
- **NewsAPI**: 1000 calls/day

Plan your refresh intervals accordingly or consider upgrading for production use.