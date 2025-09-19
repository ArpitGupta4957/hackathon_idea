import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import { Send, Bot, User, MessageCircle } from 'lucide-react';

// STYLED COMPONENTS
// ===============================================

const ChatContainer = styled.div`
  min-height: 100vh;
  background: #0a2342;
  background-image: linear-gradient(120deg, #0a2342 60%, #00c896 100%, #ffffff 120%);
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
  color: white;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: center;
  justify-content: center;
`;

const ChatWindow = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  background: ${props => (props.isUser ? '#00c896' : '#fff')};
  color: ${props => (props.isUser ? '#fff' : '#0a2342')};
  border-radius: 50%;
  min-width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px; /* Aligns icon with the bottom of the bubble */
`;

const MessageBubble = styled.div`
  background: ${props => (props.isUser ? '#00c896' : '#ffffff')};
  color: ${props => (props.isUser ? 'white' : '#333')};
  padding: 0.8rem 1.2rem;
  border-radius: 20px;
  border-bottom-left-radius: ${props => (props.isUser ? '20px' : '5px')};
  border-bottom-right-radius: ${props => (props.isUser ? '5px' : '20px')};
  line-height: 1.6;
`;

const InputContainer = styled.div`
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 25px;
  padding: 0.25rem;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background: transparent;
  color: #222;
`;

const SendButton = styled.button`
  background: #0a2342;
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
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  margin: auto 0;
  padding: 2rem;
`;

const WelcomeTitle = styled.h3`
  color: white;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const WelcomeText = styled.p`
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const SampleQuestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
`;

const SampleQuestion = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

// HELPER COMPONENTS
// ===============================================

// FIX: Moved BotMessageRenderer outside the main component for clarity and removed duplicates.
const BotMessageRenderer = ({ text }) => {
  // Helper to parse a section into a table
  function parseSection(sectionTitle, text) {
    const regex = new RegExp(`${sectionTitle}\\s*\\n([\\s\\S]*?)(?=\\n\\s*\\n|$)`, 'i');
    const match = text.match(regex);
    if (!match) return null;
    const lines = match[1].split('\n').filter(line => line.trim());
    if (lines.length < 2) return null; // Needs at least a header and one row
    const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
    const rows = lines.slice(1).map(line => line.split('|').map(cell => cell.trim()).filter(Boolean));
    return { headers, rows };
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

  // If no tables found, fallback to markdown
  if (!tables.some(t => t.table)) {
    return <ReactMarkdown>{text}</ReactMarkdown>;
  }

  // Render tables and any text before/after
  let rendered = [];
  let lastIndex = 0;
  tables.forEach(({ title, table }) => {
    if (!table) return;
    const sectionRegex = new RegExp(`${title}\\s*\\n([\\s\\S]*?)(?=\\n\\s*\\n|$)`, 'i');
    const match = text.match(sectionRegex);
    if (match) {
      const start = match.index;
      if (start > lastIndex) {
        rendered.push(<ReactMarkdown key={lastIndex}>{text.slice(lastIndex, start)}</ReactMarkdown>);
      }
      rendered.push(<h3 key={title} style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>{title}</h3>);
      rendered.push(
        <div key={title + "-table"} style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', background: 'white', color: '#222', borderRadius: '10px', overflow: 'hidden', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                {table.headers.map((h, i) => <th key={i} style={{ border: '1px solid #ddd', padding: '8px', background: '#f3f3f3', textAlign: 'left' }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => <td key={j} style={{ border: '1px solid #ddd', padding: '8px' }}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      lastIndex = start + match[0].length;
    }
  });
  if (lastIndex < text.length) {
    rendered.push(<ReactMarkdown key={lastIndex}>{text.slice(lastIndex)}</ReactMarkdown>);
  }
  return <>{rendered}</>;
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