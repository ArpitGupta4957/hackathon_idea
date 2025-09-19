import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import MainPage from './pages/MainPage';
import ChatbotPage from './pages/ChatbotPage';
import FinTrackerAbout from './pages/aboutUs';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/aboutus" element={<FinTrackerAbout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
