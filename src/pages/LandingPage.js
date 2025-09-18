import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { TrendingUp, MessageCircle, BarChart3, DollarSign, PieChart, Activity } from 'lucide-react';

const LandingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
`;

const Hero = styled.section`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
`;

const HeroContent = styled.div`
  max-width: 800px;
  color: white;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2.5rem;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  text-decoration: none;
  border-radius: 15px;
  font-size: 1.2rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const Features = styled.section`
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FeaturesTitle = styled.h2`
  text-align: center;
  color: white;
  font-size: 2.5rem;
  margin-bottom: 3rem;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  color: white;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  margin-bottom: 1rem;
  opacity: 0.9;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  opacity: 0.8;
  line-height: 1.6;
`;

const LandingPage = () => {
  return (
    <LandingContainer>
      <Hero>
        <HeroContent>
          <Title>FinTracker</Title>
          <Subtitle>
            Your comprehensive financial dashboard with real-time market data, 
            intelligent insights, and AI-powered assistance
          </Subtitle>
          <ButtonContainer>
            <ActionButton to="/main">
              <TrendingUp size={24} />
              Market Dashboard
            </ActionButton>
            <ActionButton to="/chatbot">
              <MessageCircle size={24} />
              AI Assistant
            </ActionButton>
          </ButtonContainer>
        </HeroContent>
      </Hero>
      
      <Features>
        <FeaturesContainer>
          <FeaturesTitle>Powerful Features</FeaturesTitle>
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>
                <BarChart3 size={48} />
              </FeatureIcon>
              <FeatureTitle>Live Stock Data</FeatureTitle>
              <FeatureDescription>
                Real-time stock prices, charts, and market trends to keep you informed about your investments
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <Activity size={48} />
              </FeatureIcon>
              <FeatureTitle>Market News</FeatureTitle>
              <FeatureDescription>
                Latest financial news and market updates to help you make informed investment decisions
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <MessageCircle size={48} />
              </FeatureIcon>
              <FeatureTitle>AI Assistant</FeatureTitle>
              <FeatureDescription>
                Smart chatbot to answer your financial questions and provide personalized investment insights
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <PieChart size={48} />
              </FeatureIcon>
              <FeatureTitle>Portfolio Analytics</FeatureTitle>
              <FeatureDescription>
                Comprehensive analysis tools to track performance and optimize your investment portfolio
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </FeaturesContainer>
      </Features>
    </LandingContainer>
  );
};

export default LandingPage;