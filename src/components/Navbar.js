import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { TrendingUp, MessageCircle, Home } from 'lucide-react';

const NavContainer = styled.nav`
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const Navbar = () => {
  const location = useLocation();
  
  return (
    <NavContainer>
      <NavContent>
        <Logo>
          <TrendingUp size={28} />
          FinTracker
        </Logo>
        <NavLinks>
          <NavLink to="/" $active={location.pathname === '/'}>
            <Home size={20} />
            Home
          </NavLink>
          <NavLink to="/main" $active={location.pathname === '/main'}>
            <TrendingUp size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/chatbot" $active={location.pathname === '/chatbot'}>
            <MessageCircle size={20} />
            AI Assistant
          </NavLink>
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
};

export default Navbar;