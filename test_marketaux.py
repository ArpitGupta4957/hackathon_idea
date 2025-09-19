#!/usr/bin/env python3
"""
Test script for Marketaux API integration
"""

import asyncio
import sys
import os

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.marketaux import MarketauxClient, _normalize_marketaux_news, _create_news_summary

async def test_marketaux_integration():
    """Test the Marketaux API integration"""
    
    print("🧪 Testing Marketaux API Integration...")
    print("=" * 60)
    
    # Initialize client
    client = MarketauxClient("TpRLSwr0gbIZGDjeiqWLQ5jc2uf6MObqRsH8r5Xu")
    
    try:
        # Test 1: Get general market news
        print("\n📰 Test 1: General Market News")
        print("-" * 40)
        
        market_news = await client.get_market_news(limit=5)
        normalized = _normalize_marketaux_news(market_news)
        summary = _create_news_summary(normalized["articles"])
        
        print(f"✅ Found {len(normalized['articles'])} articles")
        print(summary)
        
        # Test 2: Get news for a specific symbol
        print("\n📈 Test 2: Apple (AAPL) News")
        print("-" * 40)
        
        aapl_news = await client.get_stock_news("AAPL", limit=3)
        normalized_aapl = _normalize_marketaux_news(aapl_news)
        summary_aapl = _create_news_summary(normalized_aapl["articles"], "AAPL")
        
        print(f"✅ Found {len(normalized_aapl['articles'])} AAPL articles")
        print(summary_aapl)
        
        # Test 3: Search news
        print("\n🔍 Test 3: Search 'Tesla' News")
        print("-" * 40)
        
        tesla_news = await client.search_news("Tesla", limit=3)
        normalized_tesla = _normalize_marketaux_news(tesla_news)
        summary_tesla = _create_news_summary(normalized_tesla["articles"])
        
        print(f"✅ Found {len(normalized_tesla['articles'])} Tesla articles")
        print(summary_tesla)
        
        # Test 4: Check API response structure
        print("\n🔧 Test 4: API Response Structure")
        print("-" * 40)
        
        if normalized["articles"]:
            sample_article = normalized["articles"][0]
            print("✅ Sample article structure:")
            for key, value in sample_article.items():
                if key != "raw":  # Skip raw data
                    print(f"  • {key}: {str(value)[:50]}{'...' if len(str(value)) > 50 else ''}")
        
        print("\n🎉 All tests completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()
        
    finally:
        # Cleanup
        await client.close()
        print("\n🧹 Cleaned up resources")

async def test_sentiment_analysis():
    """Test sentiment analysis functionality"""
    
    print("\n📊 Testing Sentiment Analysis...")
    print("=" * 60)
    
    client = MarketauxClient("TpRLSwr0gbIZGDjeiqWLQ5jc2uf6MObqRsH8r5Xu")
    
    try:
        # Get news for analysis
        news_data = await client.get_stock_news("TSLA", limit=10)
        normalized = _normalize_marketaux_news(news_data)
        
        # Analyze sentiment
        sentiment_counts = {"positive": 0, "negative": 0, "neutral": 0}
        total_relevance = 0
        
        for article in normalized["articles"]:
            sentiment = article.get("sentiment", "neutral")
            sentiment_counts[sentiment] += 1
            relevance = article.get("relevance_score") or 0
            total_relevance += relevance
        
        total_articles = len(normalized["articles"])
        
        if total_articles > 0:
            sentiment_score = (
                (sentiment_counts["positive"] - sentiment_counts["negative"]) / total_articles
            )
            avg_relevance = total_relevance / total_articles
            
            print(f"📈 TSLA Sentiment Analysis:")
            print(f"  • Total Articles: {total_articles}")
            print(f"  • Positive: {sentiment_counts['positive']} ({sentiment_counts['positive']/total_articles*100:.1f}%)")
            print(f"  • Negative: {sentiment_counts['negative']} ({sentiment_counts['negative']/total_articles*100:.1f}%)")
            print(f"  • Neutral: {sentiment_counts['neutral']} ({sentiment_counts['neutral']/total_articles*100:.1f}%)")
            print(f"  • Sentiment Score: {sentiment_score:.2f} (-1 to 1)")
            print(f"  • Average Relevance: {avg_relevance:.2f}")
            
            if sentiment_score > 0.2:
                print("  🐂 Overall: BULLISH")
            elif sentiment_score < -0.2:
                print("  🐻 Overall: BEARISH")
            else:
                print("  ⚪ Overall: NEUTRAL")
        
    except Exception as e:
        print(f"❌ Sentiment analysis error: {e}")
        
    finally:
        await client.close()

def main():
    """Main test function"""
    print("🚀 Marketaux Integration Test Suite")
    print("🔑 Using API Token: TpRLSwr0gbIZGDjeiqWLQ5jc2uf6MObqRsH8r5Xu")
    
    # Run basic tests
    asyncio.run(test_marketaux_integration())
    
    # Run sentiment tests
    asyncio.run(test_sentiment_analysis())
    
    print("\n✨ Test suite completed!")

if __name__ == "__main__":
    main()