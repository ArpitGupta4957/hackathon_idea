# Financial Tracker - Real-Time Stock Integration Setup

## Backend Setup

### 1. Install Python Dependencies
```bash
pip install fastapi finnhub-python uvicorn
```

Or use the requirements file:
```bash
pip install -r requirements.txt
```

### 2. Get Finnhub API Key
1. Go to [https://finnhub.io/](https://finnhub.io/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Replace "YOUR_API_KEY" in `backend.py` with your actual API key

### 3. Start the Backend Server
```bash
python backend.py
```

The API will be available at `http://localhost:8000`

### API Endpoints:
- `GET /` - Health check
- `GET /realtime/{symbol}` - Get real-time stock data for a symbol (e.g., AAPL, TSLA, GOOGL)

## Frontend Setup

### 1. Install Dependencies (Already Done)
```bash
npm install react-chartjs-2 chart.js axios
```

### 2. Start the React App
```bash
npm start
```

The app will be available at `http://localhost:3000`

## How It Works

1. The React frontend fetches real-time stock data from the FastAPI backend every 5 seconds
2. The backend calls the Finnhub API to get current stock prices
3. The frontend displays the data in a real-time updating chart
4. Users can change the stock symbol to track different stocks

## Features

- Real-time stock price updates
- Interactive line chart showing price history
- Current price display with change indicators
- Ability to switch between different stock symbols
- Responsive design that works on different screen sizes

## Note

Make sure both the backend (port 8000) and frontend (port 3000) are running for the integration to work properly.

If you encounter CORS errors, ensure the backend CORS middleware is properly configured to allow requests from your frontend domain.