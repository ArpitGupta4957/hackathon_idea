import React from 'react';
import { useNavigate } from 'react-router-dom';

import widgetImg from '../OIP.jpg';

const ChatbotWidget = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 1000,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      onClick={() => navigate('/chatbot')}
      title="Open Chatbot"
    >
      <img
        src={widgetImg}
        alt="Chatbot Widget"
        style={{
          width: 90,
          height: 90,
          borderRadius: '50%',
          boxShadow: '0 4px 24px rgba(10,35,66,0.18)',
          border: '4px solid #00c896',
          background: '#fff',
        }}
      />
      <span
        style={{
          marginTop: 8,
          background: '#00c896',
          color: '#fff',
          padding: '4px 16px',
          borderRadius: 16,
          fontWeight: 700,
          fontSize: 14,
          boxShadow: '0 2px 8px #00c89633',
        }}
      >
        Ask FinBot
      </span>
    </div>
  );
};

export default ChatbotWidget;
