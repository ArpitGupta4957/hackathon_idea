import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import StockChart from '../components/StockChart';
import NewsComponent from '../components/NewsComponent';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Globe } from 'lucide-react';

const MainContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  color: #2d3748;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Dashboard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatsCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StatIcon = styled.div`
  padding: 1rem;
  border-radius: 12px;
  background: ${props => props.color || '#3182ce'};
  color: white;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #2d3748;
`;

const StatLabel = styled.div`
  color: #718096;
  margin-top: 0.5rem;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  color: #2d3748;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NewsSection = styled.div`
  margin-top: 2rem;
`;



// Sample data for charts
const portfolioData = [
  { name: 'Stocks', value: 45, color: '#3182ce' },
  { name: 'Bonds', value: 25, color: '#38a169' },
  { name: 'ETFs', value: 20, color: '#d69e2e' },
  { name: 'Cash', value: 10, color: '#e53e3e' },
];



const StockInputSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StockInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #3182ce;
  }
`;

const StockButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #3182ce;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #2c5aa0;
  }
`;

const MainPage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [inputSymbol, setInputSymbol] = useState('');

  const handleSymbolChange = () => {
    if (inputSymbol.trim()) {
      setSelectedSymbol(inputSymbol.trim().toUpperCase());
      setInputSymbol('');
    }
  };

  return (
    <MainContainer>
      <Navbar />
      <Content>
        <PageTitle>
          <Activity size={36} />
          Market Dashboard
        </PageTitle>
        
        <Dashboard>
          <StatsCard>
            <StatIcon color="#38a169">
              <TrendingUp size={24} />
            </StatIcon>
            <StatInfo>
              <StatValue>$24,500</StatValue>
              <StatLabel>Portfolio Value</StatLabel>
            </StatInfo>
          </StatsCard>
          
          <StatsCard>
            <StatIcon color="#3182ce">
              <DollarSign size={24} />
            </StatIcon>
            <StatInfo>
              <StatValue>+$1,250</StatValue>
              <StatLabel>Today's P&L</StatLabel>
            </StatInfo>
          </StatsCard>
          
          <StatsCard>
            <StatIcon color="#d69e2e">
              <Activity size={24} />
            </StatIcon>
            <StatInfo>
              <StatValue>+5.2%</StatValue>
              <StatLabel>Total Return</StatLabel>
            </StatInfo>
          </StatsCard>
          
          <StatsCard>
            <StatIcon color="#e53e3e">
              <TrendingDown size={24} />
            </StatIcon>
            <StatInfo>
              <StatValue>-2.1%</StatValue>
              <StatLabel>Day Change</StatLabel>
            </StatInfo>
          </StatsCard>
        </Dashboard>

        <StockInputSection>
          <label style={{ color: '#2d3748', fontWeight: 'bold' }}>Track Stock Symbol:</label>
          <StockInput
            type="text"
            placeholder="Enter stock symbol (e.g., TSLA, GOOGL, MSFT)"
            value={inputSymbol}
            onChange={(e) => setInputSymbol(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSymbolChange()}
          />
          <StockButton onClick={handleSymbolChange}>
            Update Chart
          </StockButton>
          <span style={{ color: '#718096', marginLeft: 'auto' }}>
            Currently tracking: <strong>{selectedSymbol}</strong>
          </span>
        </StockInputSection>
        
        <ChartsSection>
          <ChartCard>
            <StockChart symbol={selectedSymbol} refreshInterval={5000} />
          </ChartCard>
          
          <ChartCard>
            <ChartTitle>
              <Activity size={20} />
              Portfolio Allocation
            </ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </ChartsSection>
        
        <NewsSection>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <ChartCard>
              <NewsComponent 
                symbol={selectedSymbol} 
                refreshInterval={60000} 
                showGeneral={false}
              />
            </ChartCard>
            <ChartCard>
              <NewsComponent 
                showGeneral={true} 
                refreshInterval={60000}
              />
            </ChartCard>
          </div>
        </NewsSection>
      </Content>
    </MainContainer>
  );
};

export default MainPage;