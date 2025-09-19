import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const NewsComponent = ({ symbol = 'AAPL', refreshInterval = 60000, showGeneral = false }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchNews = useCallback(async () => {
    try {
      const endpoint = showGeneral 
        ? 'http://localhost:8001/market/general-news'
        : `http://localhost:8001/news/${symbol}`;
      
      const response = await axios.get(endpoint);
      
      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      setNews(response.data.articles || []);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch news. Make sure your FastAPI backend is running on http://localhost:8001');
      setLoading(false);
    }
  }, [symbol, showGeneral]);

  useEffect(() => {
    // Fetch news immediately
    fetchNews();
    
    // Set up interval for updates
    const interval = setInterval(fetchNews, refreshInterval);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [fetchNews, refreshInterval]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch {
      return dateString;
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>📰</div>
        <p>Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>❌</div>
        <p>Error: {error}</p>
        <button 
          onClick={fetchNews} 
          style={{ 
            marginTop: '10px', 
            padding: '10px 20px',
            backgroundColor: '#3182ce',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '10px'
      }}>
        <h3 style={{ margin: 0, color: '#2d3748' }}>
          📰 {showGeneral ? 'Market News' : `${symbol} News`}
        </h3>
        <div style={{ fontSize: '12px', color: '#718096' }}>
          Last updated: {lastUpdated}
        </div>
      </div>

      {news.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>📰</div>
          <p>No news articles found</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gap: '15px',
          maxHeight: '500px',
          overflowY: 'auto'
        }}>
          {news.slice(0, 10).map((article, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '15px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
              onClick={() => article.url && window.open(article.url, '_blank')}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '8px'
              }}>
                <h4 style={{ 
                  margin: 0, 
                  color: '#2d3748', 
                  fontSize: '16px',
                  lineHeight: '1.4',
                  flex: 1
                }}>
                  {article.title || 'Untitled Article'}
                </h4>
                {article.image_url && (
                  <img 
                    src={article.image_url} 
                    alt="Article"
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      marginLeft: '10px'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                fontSize: '12px', 
                color: '#718096',
                marginBottom: '8px'
              }}>
                <span>🏢 {article.source || 'Unknown Source'}</span>
                <span>🕒 {formatDate(article.time_published)}</span>
                {article.author && <span>✍️ {article.author}</span>}
              </div>
              
              {article.summary && (
                <p style={{ 
                  margin: 0, 
                  color: '#4a5568', 
                  lineHeight: '1.5',
                  fontSize: '14px'
                }}>
                  {truncateText(article.summary)}
                </p>
              )}
              
              {article.ticker_sentiment && (
                <div style={{ 
                  marginTop: '8px',
                  fontSize: '12px',
                  color: '#718096'
                }}>
                  Sentiment: {JSON.stringify(article.ticker_sentiment)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div style={{ 
        marginTop: '15px', 
        textAlign: 'center', 
        color: '#718096',
        fontSize: '12px'
      }}>
        <small>Updates every {Math.round(refreshInterval / 1000)} seconds</small>
      </div>
    </div>
  );
};

export default NewsComponent;