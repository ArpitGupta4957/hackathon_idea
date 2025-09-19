import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockChart = ({ symbol = 'AAPL', refreshInterval = 5000 }) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const intervalRef = useRef(null);

  const fetchStockData = useCallback(async () => {
    try {
      // Replace with your FastAPI backend URL
      const response = await axios.get(`http://localhost:8002/realtime/${symbol}`);
      
      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      const newDataPoint = {
        timestamp: new Date().toLocaleTimeString(),
        price: response.data.data.current_price,
        change: response.data.data.change,
        percentChange: response.data.data.percent_change,
        high: response.data.data.high,
        low: response.data.data.low,
        open: response.data.data.open,
        previousClose: response.data.data.previous_close
      };

      setCurrentPrice(newDataPoint);
      
      setStockData(prevData => {
        const newData = [...prevData, newDataPoint];
        // Keep only the last 20 data points for better performance
        return newData.slice(-20);
      });
      
      setError(null);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch stock data. Make sure your FastAPI backend is running on http://localhost:8001');
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    // Fetch data immediately
    fetchStockData();
    
    // Set up interval for real-time updates
    intervalRef.current = setInterval(fetchStockData, refreshInterval);
    
    // Cleanup interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchStockData, refreshInterval]);

  const chartData = {
    labels: stockData.map(data => data.timestamp),
    datasets: [
      {
        label: `${symbol} Price`,
        data: stockData.map(data => data.price),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${symbol} Real-Time Stock Price`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      },
    },
    animation: {
      duration: 0, // Disable animation for real-time updates
    },
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>Loading stock data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
        <p>Error: {error}</p>
        <button onClick={fetchStockData} style={{ marginTop: '10px', padding: '10px 20px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {currentPrice && (
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>{symbol} Current Price: ${currentPrice.price.toFixed(2)}</h3>
          <p style={{ color: currentPrice.change >= 0 ? 'green' : 'red' }}>
            Change: {currentPrice.change >= 0 ? '+' : ''}{currentPrice.change.toFixed(2)} 
            ({currentPrice.percentChange >= 0 ? '+' : ''}{currentPrice.percentChange.toFixed(2)}%)
          </p>
          <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
            <span>Open: ${currentPrice.open.toFixed(2)}</span>
            <span>High: ${currentPrice.high.toFixed(2)}</span>
            <span>Low: ${currentPrice.low.toFixed(2)}</span>
            <span>Previous Close: ${currentPrice.previousClose.toFixed(2)}</span>
          </div>
        </div>
      )}
      
      <div style={{ height: '400px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
      
      <div style={{ marginTop: '10px', textAlign: 'center', color: '#666' }}>
        <small>Updates every {refreshInterval / 1000} seconds</small>
      </div>
    </div>
  );
};

export default StockChart;