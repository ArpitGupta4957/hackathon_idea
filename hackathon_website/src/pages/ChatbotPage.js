import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import { Send, Bot, User, MessageCircle } from 'lucide-react';

// STYLED COMPONENTS
// ===============================================

const ChatContainer = styled.div`
  min-height: 100vh;
  background-color: #181b20;
  background-image: linear-gradient(#181b20, #181b20 23%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0) 92%, #181b20), 
                    url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='8' cy='8' r='1' fill='%23333a44'/%3E%3C/svg%3E");
  background-position: 0 0, 0 0;
  background-size: auto, 16px;
  color: #fefefd;
`;

const Content = styled.div`
  max-width: 1700px;
  margin: 0 auto;
  padding: 2rem;
  height: calc(100vh - 80px); /* Assuming Navbar height is 80px */
  display: flex;
  flex-direction: column;
`;

const PageTitle = styled.h1`
  background: linear-gradient(90deg, #a770ef 0%, #fdb99b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: center;
  justify-content: center;
  
  @media screen and (max-width: 767px) {
    font-size: 2.5rem;
  }
`;

const ChatWindow = styled.div`
  flex: 1;
  background: rgba(29, 33, 39, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid #333a44;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// FIX: Correctly defined the 'Message' styled-component and added missing components.
const Message = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
  align-items: flex-end;
  max-width: 80%;
  align-self: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
`;

const MessageIcon = styled.div`
  background: ${props => (props.isUser ? 'linear-gradient(90deg, #a770ef 0%, #fdb99b 100%)' : '#1d2127')};
  color: ${props => (props.isUser ? '#fff' : '#a770ef')};
  border: 1px solid ${props => (props.isUser ? 'transparent' : '#555d6a')};
  border-radius: 50%;
  min-width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
`;

const MessageBubble = styled.div`
  background: ${props => (props.isUser ? 'linear-gradient(90deg, #a770ef 0%, #fdb99b 100%)' : '#1d2127')};
  color: ${props => (props.isUser ? 'white' : '#fefefd')};
  border: 1px solid ${props => (props.isUser ? 'transparent' : '#555d6a')};
  padding: 0.8rem 1.2rem;
  border-radius: 20px;
  border-bottom-left-radius: ${props => (props.isUser ? '20px' : '5px')};
  border-bottom-right-radius: ${props => (props.isUser ? '5px' : '20px')};
  line-height: 1.6;
`;

const InputContainer = styled.div`
  padding: 1rem 2rem;
  background: rgba(29, 33, 39, 0.8);
  border-top: 1px solid #333a44;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #1d2127;
  border: 1px solid #555d6a;
  border-radius: 25px;
  padding: 0.25rem;
  transition: border-color 0.2s;
  
  &:focus-within {
    border-color: #a770ef;
  }
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background: transparent;
  color: #fefefd;
  
  &::placeholder {
    color: #a0a7b3;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(90deg, #a770ef 0%, #fdb99b 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(167, 112, 239, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
  color: #d0d6de;
  margin: auto 0;
  padding: 2rem;
`;

const WelcomeTitle = styled.h3`
  background: linear-gradient(90deg, #a770ef 0%, #fdb99b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: 700;
`;

const WelcomeText = styled.p`
  line-height: 1.6;
  margin-bottom: 1rem;
  color: #fefefd;
  font-size: 1.125rem;
`;

const SampleQuestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
`;

const SampleQuestion = styled.button`
  background: #1d2127;
  border: 1px solid #555d6a;
  color: #fefefd;
  padding: 0.75rem 1.25rem;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: #242831;
    border-color: #a770ef;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(167, 112, 239, 0.2);
  }
`;

// HELPER COMPONENTS
// ===============================================

// FIX: Improved BotMessageRenderer to properly parse all three tables
const BotMessageRenderer = ({ text }) => {
  // Helper to parse a section into a table
  function parseSection(sectionTitle, text) {
    // More robust regex that looks for the next ### or end of string
    const regex = new RegExp(`###\\s*${sectionTitle}\\s*\\n([\\s\\S]*?)(?=\\n###|$)`, 'i');
    const match = text.match(regex);
    if (!match) return null;
    
    const sectionContent = match[1].trim();
    const lines = sectionContent.split('\n').filter(line => line.trim());
    if (lines.length < 3) return null; // Needs at least header, separator, and one data row
    
    // Skip the separator line (the --- line)
    const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
    const dataLines = lines.slice(2); // Skip header and separator
    const rows = dataLines.map(line => line.split('|').map(cell => cell.trim()).filter(Boolean));
    
    return { headers, rows: rows.filter(row => row.length > 0) };
  }

  const sections = [
    { title: 'Top Gainers', key: 'gainers' },
    { title: 'Top Losers', key: 'losers' },
    { title: 'Most Active', key: 'active' },
  ];

  // Try to extract each section
  const tables = sections.map(section => ({
    ...section,
    table: parseSection(section.title, text)
  }));

  // Check if we found any tables
  const foundTables = tables.filter(t => t.table);
  
  // If no tables found, fallback to regular markdown
  if (foundTables.length === 0) {
    return <ReactMarkdown>{text}</ReactMarkdown>;
  }

  // Render all found tables
  return (
    <div>
      {foundTables.map(({ title, table }) => (
        <div key={title} style={{ marginBottom: '2rem' }}>
          <h3 style={{ 
            marginTop: '1rem', 
            marginBottom: '0.5rem',
            background: 'linear-gradient(90deg, #a770ef 0%, #fdb99b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {title}
          </h3>
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ 
              borderCollapse: 'collapse', 
              width: '100%', 
              background: 'white', 
              color: '#222', 
              borderRadius: '10px', 
              overflow: 'hidden', 
              fontSize: '0.9rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <thead>
                <tr>
                  {table.headers.map((h, i) => (
                    <th key={i} style={{ 
                      border: '1px solid #ddd', 
                      padding: '12px 8px', 
                      background: '#f8f9fa', 
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '0.85rem'
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i === table.rows.length - 1 ? 'none' : '1px solid #f0f0f0' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ 
                        border: '1px solid #ddd', 
                        padding: '10px 8px',
                        fontSize: '0.85rem'
                      }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

// MAIN COMPONENT
// ===============================================

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const sampleQuestions = [
    "What's the current market trend?",
    "How should I diversify my portfolio?",
    "What are the best stocks to buy now?",
    "Explain compound interest"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const API_PORT = process.env.REACT_APP_API_PORT || 8002;
      const response = await fetch(`http://localhost:${API_PORT}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      let botResponse = '';
      if (data?.result?.markdown) {
        botResponse = data.result.markdown;
      } else if (data?.result) {
        botResponse = typeof data.result === 'string' ? data.result : JSON.stringify(data.result);
      } else if (data?.error) {
        botResponse = data.error;
      } else {
        botResponse = 'Sorry, I could not fetch a response.';
      }
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        text: 'Error fetching response from server. Please ensure the backend is running.',
        isUser: false,
        timestamp: new Date()
      }]);
    }
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ChatContainer>
      <Navbar transparent />
      <Content>
        <PageTitle>
          <MessageCircle size={36} />
          Ai FinBot
        </PageTitle>
        
        <ChatWindow>
          <MessagesContainer>
            {messages.length === 0 && (
              <WelcomeMessage>
                <WelcomeTitle>Welcome to your AI Financial Assistant!</WelcomeTitle>
                <WelcomeText>
                  I'm here to help you with financial questions, market insights, and investment guidance.
                  Ask me anything about stocks, portfolio management, or financial planning.
                </WelcomeText>
                <SampleQuestions>
                  {sampleQuestions.map((question, index) => (
                    <SampleQuestion
                      key={index}
                      onClick={() => handleSendMessage(question)}
                    >
                      {question}
                    </SampleQuestion>
                  ))}
                </SampleQuestions>
              </WelcomeMessage>
            )}
            
            {messages.map((message) => (
              <Message key={message.id} isUser={message.isUser}>
                {!message.isUser && (
                  <MessageIcon isUser={false}>
                    <Bot size={20} />
                  </MessageIcon>
                )}
                <MessageBubble isUser={message.isUser}>
                  {message.isUser ? (
                    message.text
                  ) : (
                    <BotMessageRenderer text={message.text} />
                  )}
                </MessageBubble>
                {message.isUser && (
                  <MessageIcon isUser={true}>
                    <User size={20} />
                  </MessageIcon>
                )}
              </Message>
            ))}
            
            {isTyping && (
              <Message isUser={false}>
                <MessageIcon isUser={false}>
                  <Bot size={20} />
                </MessageIcon>
                <MessageBubble isUser={false}>
                  AI is typing...
                </MessageBubble>
              </Message>
            )}
            <div ref={messagesEndRef} />
          </MessagesContainer>
          
          <InputContainer>
            <InputWrapper>
              <Input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about stocks, investments, or financial planning..."
                disabled={isTyping}
              />
              <SendButton
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
              >
                <Send size={20} />
              </SendButton>
            </InputWrapper>
          </InputContainer>
        </ChatWindow>
      </Content>
    </ChatContainer>
  );
};

export default ChatbotPage;