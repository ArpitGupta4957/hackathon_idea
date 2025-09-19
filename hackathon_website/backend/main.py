import finnhub
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Finnhub client - Replace with your API key
finnhub_client = finnhub.Client(api_key="d35veh1r01qhqkb46fc0d35veh1r01qhqkb46fcg")

@app.get("/realtime/{symbol}")
def get_realtime_stock(symbol: str):
    try:
        # Get real-time quote data
        data = finnhub_client.quote(symbol)
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
        return {"error": str(e)}

@app.get("/")
def read_root():
    return {"status": "online", "message": "Stock API is running"}