import os
import finnhub
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Get configuration from environment variables
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY", "demo_key")
PORT = int(os.getenv("PORT", "8002"))

# Allow CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Finnhub client using environment variable
finnhub_client = finnhub.Client(api_key=FINNHUB_API_KEY)

@app.get("/realtime/{symbol}")
def get_realtime_stock(symbol: str):
    try:
        # Get real-time quote data
        data = finnhub_client.quote(symbol)
        
        # Check if we got valid data
        if not data or data.get("c") is None:
            return {
                "error": "Invalid API response. Please check your Finnhub API key at https://finnhub.io/",
                "symbol": symbol,
                "suggestion": "Get a free API key from https://finnhub.io/ and replace it in backend.py"
            }
        
        return {
            "symbol": symbol,
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
        error_msg = str(e)
        if "401" in error_msg or "Invalid API key" in error_msg:
            return {
                "error": "Invalid Finnhub API key",
                "message": "Please get a free API key from https://finnhub.io/ and update backend.py",
                "symbol": symbol
            }
        return {"error": error_msg, "symbol": symbol}

@app.get("/")
def read_root():
    return {"status": "online", "message": "Stock API is running"}

if __name__ == "__main__":
    import uvicorn
    print(f"🌟 Starting Simple Stock API on port {PORT}...")
    print("📊 Note: For full functionality (stock + news), use backend/server.py on port 8001")
    print(f"📋 Using Finnhub API Key: {FINNHUB_API_KEY[:8]}...")
    uvicorn.run("backend:app", host="0.0.0.0", port=PORT, reload=True)