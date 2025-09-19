import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { TrendingUp, MessageCircle, BarChart3, DollarSign, PieChart, Activity } from 'lucide-react';

const LandingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(120deg, #0a2342 60%, #00c896 100%, #ffffff 120%);
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
  padding: 5rem 2rem 6rem 2rem;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FeaturesTitle = styled.h2`
  text-align: center;
  color: #fff;
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 3.5rem;
  letter-spacing: 1.5px;
  text-shadow: 0 4px 24px rgba(10,35,66,0.18);
`;

const FeatureGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
  width: 100%;
  max-width: 1200px;
  overflow-x: auto;
  padding-bottom: 1rem;
  scrollbar-width: thin;
  scrollbar-color: #00c896 #0a2342;

  &::-webkit-scrollbar {
    height: 12px;
    background: #0a2342;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #00c896;
    border-radius: 8px;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255,255,255,0.18);
  box-shadow: 0 8px 32px 0 rgba(10,35,66,0.18);
  border-radius: 22px;
  border: 1.5px solid rgba(0,200,150,0.18);
  padding: 2.5rem 2rem 2.2rem 2rem;
  text-align: center;
  color: #fff;
  backdrop-filter: blur(18px);
  transition: transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s;
  position: relative;
  overflow: hidden;
  z-index: 1;
  &:before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(120deg, #00c89633 0%, #0a2342 100%);
    opacity: 0.7;
    border-radius: 22px;
  }
  &:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 16px 48px 0 rgba(0,200,150,0.18);
    border-color: #00c896;
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
          <Subtitle style={{
            fontWeight: 'bold',
            color: '#0a2342',
            background: 'linear-gradient(90deg, #00c89622 0%, #e0ffe6 100%)',
            borderRadius: '10px',
            padding: '1rem 1.5rem',
            fontSize: '1.6rem',
            boxShadow: '0 2px 12px rgba(0,200,150,0.08)',
            marginBottom: '2.5rem',
            display: 'inline-block',
          }}>
            "Success in the digital world isn’t about predicting the future — it’s about preparing to adapt faster than anyone else."
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
      {/* Vision Section */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '4rem',
        marginBottom: '3rem',
      }}>
        <div style={{
          color: '#fff',
          fontSize: '2.5rem',
          fontWeight: 800,
          marginBottom: '1.5rem',
          textAlign: 'center',
          letterSpacing: '1.5px',
          textShadow: '0 4px 24px rgba(10,35,66,0.18)'
        }}>
          Our vision
        </div>
        <div style={{
          maxWidth: 1000,
          textAlign: 'center',
          fontWeight: 500,
          fontSize: '2rem',
          lineHeight: 1.3,
          color: '#dbc8c8ff',
          margin: '0 auto',
        }}>
          Our vision is to revolutionize financial decision-making for everyone.<br />
          We aim to empower users with real-time data, intelligent insights, and AI-powered tools,<br />
          making finance accessible, transparent, and actionable.<br />
          Together, we build a smarter, more confident financial future.
        </div>
      </div>
    </LandingContainer>
  );
};

export default LandingPage;