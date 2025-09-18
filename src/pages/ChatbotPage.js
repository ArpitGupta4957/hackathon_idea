import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import { Send, Bot, User, MessageCircle } from 'lucide-react';

const ChatContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Content = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  height: calc(100vh - 80px);
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

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 1rem 1.5rem;
  border-radius: 20px;
  background: ${props => props.isUser 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'rgba(255, 255, 255, 0.9)'};
  color: ${props => props.isUser ? 'white' : '#2d3748'};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
`;

const MessageIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.isUser 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'white'};
  color: ${props => props.isUser ? 'white' : '#667eea'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
`;

const InputContainer = styled.div`
  padding: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.9);
  color: #2d3748;
  font-size: 1rem;
  outline: none;
  backdrop-filter: blur(10px);
  
  &::placeholder {
    color: #718096;
  }
  
  &:focus {
    background: white;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }
`;

const SendButton = styled.button`
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
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
  margin-bottom: 2rem;
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

const sampleResponses = {
  "What's the current market trend?": "Based on recent market data, we're seeing a mixed trend with technology stocks showing strength while energy sectors face some volatility. The overall market sentiment remains cautiously optimistic with moderate trading volumes.",
  "How should I diversify my portfolio?": "A well-diversified portfolio typically includes a mix of stocks (60-70%), bonds (20-30%), and alternative investments (5-10%). Consider your risk tolerance, investment timeline, and financial goals. It's always wise to consult with a financial advisor for personalized advice.",
  "What are the best stocks to buy now?": "I can't provide specific investment advice, but I can help you understand how to evaluate stocks using fundamental analysis, technical indicators, and market trends. Consider factors like P/E ratios, earnings growth, and sector performance when making investment decisions.",
  "Explain compound interest": "Compound interest is the interest calculated on the initial principal and also on the accumulated interest from previous periods. It's often called 'interest on interest' and can significantly boost your investment returns over time. The formula is A = P(1 + r/n)^(nt), where A is the final amount, P is principal, r is annual interest rate, n is compounding frequency, and t is time in years."
};

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    // Simulate AI response delay
    setTimeout(() => {
      let botResponse = sampleResponses[message] || 
        "I'm a demo AI assistant for financial queries. In a real implementation, I would connect to financial APIs and provide real-time market data, investment insights, and personalized financial advice. For now, try asking about diversification, market trends, or compound interest!";

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSampleQuestion = (question) => {
    handleSendMessage(question);
  };

  return (
    <ChatContainer>
      <Navbar />
      <Content>
        <PageTitle>
          <MessageCircle size={36} />
          AI Financial Assistant
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
                  {Object.keys(sampleResponses).map((question, index) => (
                    <SampleQuestion 
                      key={index} 
                      onClick={() => handleSampleQuestion(question)}
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
                  {message.text}
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
                onClick={handleSendMessage}
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