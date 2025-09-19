import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { TrendingUp, MessageCircle, BarChart3, Activity, PieChart, DollarSign } from 'lucide-react';

// Global Wrapper with VitGPT styling
const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #181b20;
  background-image: linear-gradient(#181b20, #181b20 23%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0) 92%, #181b20), 
                    url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='8' cy='8' r='1' fill='%23333a44'/%3E%3C/svg%3E");
  background-position: 0 0, 0 0;
  background-size: auto, 16px;
  color: #fefefd;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow-x: hidden;
  
  * {
    border: none !important;
    outline: none !important;
  }
  
  section {
    border: none !important;
    outline: none !important;
  }
`;

// Main wrapper
const MainWrapper = styled.div`
  position: relative;
  z-index: 1;
`

// Hero Section
const SectionHeroHeader = styled.section`
  background-image: linear-gradient(#181b20, #181b20 23%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0) 92%, #181b20), 
                    url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='8' cy='8' r='1' fill='%23333a44'/%3E%3C/svg%3E");
  background-position: 0 0, 0 0;
  background-size: auto, 16px;
  position: relative;
  overflow: hidden;
`;

const PaddingGlobal = styled.div`
  padding-left: 5%;
  padding-right: 5%;
`;

const ContainerLarge = styled.div`
  width: 100%;
  max-width: 80rem;
  margin-left: auto;
  margin-right: auto;
`;

const PaddingSectionMedium = styled.div`
  padding-top: 5rem;
  padding-bottom: 5rem;
`;

const HeaderComponent = styled.div`
  z-index: 999;
  flex-direction: column;
  align-items: center;
  display: flex;
  position: relative;
`;

const MarginBottom = styled.div`
  margin-top: 0;
  margin-left: 0;
  margin-right: 0;
  
  &.margin-xxlarge {
    margin-bottom: 5rem;
  }
`;

const TextAlignCenter = styled.div`
  text-align: center;
`;

const MaxWidthLarge = styled.div`
  width: 100%;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
`;

const MarginBottomSmall = styled.div`
  margin-top: 0;
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 1.5rem;
`;

const TextColorGradient = styled.h1`
  font-size: 4.5rem;
  line-height: 1.1;
  margin: 0;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(92deg, #a770ef, #fdb99b);
  -webkit-background-clip: text;
  background-clip: text;
  font-weight: 700;
  
  @media screen and (max-width: 767px) {
    font-size: 3rem;
  }
`;

const TextSizeMedium = styled.p`
  font-size: 1.875rem;
  margin: 0 0 2rem 0;
  color: #d0d6de;
  line-height: 1.5;
  font-weight: 500;
  
  @media screen and (max-width: 767px) {
    font-size: 1.5rem;
  }
`;

const MarginTopMedium = styled.div`
  margin-bottom: 0;
  margin-left: 0;
  margin-right: 0;
  margin-top: 2rem;
`;

const ButtonGroup = styled.div`
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const Button = styled(Link)`
  color: #181b20;
  text-align: center;
  background-color: #d0d6de;
  border: 1px solid #d0d6de;
  border-radius: 50px;
  padding: 1.25rem 2rem;
  text-decoration: none;
  transition: background-color 0.2s;
  font-size: 1.25rem;
  
  grid-column-gap: 0.75rem;
  grid-row-gap: 0.75rem;
  justify-content: center;
  align-items: center;
  display: flex;
  font-weight: 600;
  
  &:hover {
    background-color: #a0a7b3;
  }
  
  &.is-secondary {
    color: #fefefd;
    background-color: rgba(0, 0, 0, 0);
    border-color: #d0d6de;
    transition: border 0.2s, color 0.2s, background-color 0.2s;
    
    &:hover {
      color: #a0a7b3;
      border-color: #a0a7b3;
    }
  }
`;

// Layout Section
const SectionLayout = styled.section`
  background-color: transparent;
  border: none;
  outline: none;
`;

const PaddingSectionLarge = styled.div`
  padding-top: 7rem;
  padding-bottom: 7rem;
`;

const MarginBottomLarge = styled.div`
  margin-top: 0;
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 3rem;
`;

const HeadingStyleH3 = styled.h3`
  font-size: 2.5rem;
  line-height: 1.2;
  margin: 0;
  color: #fefefd;
  font-weight: 700;
`;

const LayoutComponent = styled.div`
  grid-column-gap: 4rem;
  grid-row-gap: 4rem;
  grid-template-rows: auto;
  grid-template-columns: 1fr 1fr;
  grid-auto-columns: 1fr;
  display: grid;
  align-items: center;
  
  @media screen and (max-width: 991px) {
    grid-template-columns: 1fr !important;
    text-align: center;
    
    & > * {
      order: unset !important;
    }
  }
`;

const LayoutContent = styled.div`
  flex-direction: column;
  display: flex;
`;

const LayoutImageWrapper = styled.div`
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    border: 1px solid #333a44;
    border-radius: 20px;
  }
`;

// Use Case Section
const SectionUseCase = styled.section`
  background-color: transparent;
  border: none;
  outline: none;
`;

const UseCaseComponent = styled.div`
  grid-column-gap: 4rem;
  grid-row-gap: 4rem;
  grid-template-rows: auto;
  grid-template-columns: 1fr 1fr;
  grid-auto-columns: 1fr;
  display: grid;
  align-items: start;
  
  @media screen and (max-width: 991px) {
    grid-template-columns: 1fr;
  }
`;

const UseCaseContentLeft = styled.div`
  flex-direction: column;
  display: flex;
`;

const HeadingStyleH2 = styled.h1`
  font-size: 3rem;
  line-height: 1.2;
  margin: 0;
  color: #fefefd;
  font-weight: 700;
`;

const UseCaseContentRight = styled.div`
  grid-area: span 1 / span 1 / span 1 / span 1;
`;

const UseCaseList = styled.div`
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;
  grid-template-rows: auto auto;
  grid-template-columns: 1fr 1fr;
  grid-auto-columns: 1fr;
  display: grid;
`;

const UseCaseItem = styled.div`
  background-color: #1d2127;
  border: 1px solid #555d6a;
  border-radius: 20px;
  padding: 2rem;
  transition: background-color 0.2s, border-color 0.2s;
  
  &:hover {
    background-color: #242831;
    border-color: #a770ef;
  }
`;

const IconWrapper = styled.div`
  width: 2rem;
  height: 2rem;
  color: #a770ef;
  margin-bottom: 1rem;
`;

const HeadingStyleH5 = styled.h2`
  font-size: 1.5rem;
  line-height: 1.4;
  margin: 0 0 1rem 0;
  color: #fefefd;
  font-weight: 600;
`;

const UseCaseText = styled.p`
  color: #d0d6de;
  margin: 0;
  line-height: 1.6;
`;

// Vision Section
const VisionSection = styled.section`
  padding-top: 4rem;
  padding-bottom: 3rem;
  background-color: transparent;
  border: none;
  outline: none;
`;

const VisionTitle = styled.div`
  color: #cfc6e6;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  letter-spacing: 1.2px;
`;

const VisionGradientText = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.25;
  background: linear-gradient(90deg, #a770ef 0%, #fdb99b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.5px;
  @media (max-width: 900px) {
    font-size: 2rem;
  }
  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
`;

// Call to Action Section
const SectionHeader = styled.section`
  background-image: linear-gradient(#181b20, #181b20 23%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0) 92%, #181b20), 
                    url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='8' cy='8' r='1' fill='%23333a44'/%3E%3C/svg%3E");
  background-position: 0 0, 0 0;
  background-size: auto, 16px;
  position: relative;
  overflow: hidden;
`;

const ContainerSmall = styled.div`
  width: 100%;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
`;

const CtaContent = styled.div`
  z-index: 999;
  flex-direction: column;
  align-items: center;
  display: flex;
  position: relative;
`;

const MaxWidthXLarge = styled.div`
  width: 100%;
  max-width: 56rem;
  margin-left: auto;
  margin-right: auto;
`;

const CtaGradientTitle = styled.h1`
  font-size: 3.5rem;
  line-height: 1.2;
  margin: 0 0 1rem 0;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(92deg, #a770ef, #fdb99b);
  -webkit-background-clip: text;
  background-clip: text;
  font-weight: 700;
  text-align: center;
  
  @media screen and (max-width: 767px) {
    font-size: 2.5rem;
  }
`;

const Ellipse = styled.div`
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle, rgba(167, 112, 239, 0.15) 0%, rgba(253, 185, 155, 0.08) 50%, transparent 70%);
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
`;

// FAQ Section
const SectionFaq = styled.section`
  background-color: transparent;
  border: none;
  outline: none;
`;

const FaqComponent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FaqList = styled.div`
  width: 100%;
  max-width: 48rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FaqAccordion = styled.div`
  background-color: #1d2127;
  border: 1px solid #555d6a;
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.2s;
  
  &:hover {
    border-color: #a770ef;
  }
`;

const FaqQuestion = styled.div`
  padding: 1.5rem 2rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #242831;
  }
`;

const FaqQuestionText = styled.div`
  font-size: 1.125rem;
  color: #fefefd;
  font-weight: 500;
`;

const FaqIcon = styled.div`
  width: 2rem;
  height: 2rem;
  color: #a770ef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
`;

const FaqAnswer = styled.div`
  width: 100%;
  height: 0;
  overflow: hidden;
  transition: height 0.3s ease-out;
  background-color: #1d2127;
  
  &.open {
    height: auto;
    padding: 0 2rem 1.5rem 2rem;
  }
`;

const FaqAnswerContent = styled.div`
  padding-top: 0.5rem;
`;

const FaqAnswerText = styled.p`
  color: #d0d6de;
  margin: 0;
  line-height: 1.6;
`;

// Footer Section
const FooterComponent = styled.footer`
  background-color: transparent;
  border: none;
  outline: none;
`;

const LineDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #414a57;
  margin-bottom: 2rem;
`;

const FooterBottomWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media screen and (max-width: 767px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const FooterLegalList = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  
  @media screen and (max-width: 767px) {
    justify-content: center;
  }
`;

const FooterCreditText = styled.div`
  color: #a0a7b3;
  font-size: 0.875rem;
`;

const FooterLegalLink = styled.a`
  color: #a0a7b3;
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: #fefefd;
  }
`;

const FooterSocialIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FooterSocialLink = styled.a`
  width: 2.5rem;
  height: 2.5rem;
  background-color: #1d2127;
  border: 1px solid #555d6a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a770ef;
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    background-color: #a770ef;
    color: #fefefd;
    border-color: #a770ef;
  }
`;

// Ellipse background element
const EllipseHero = styled.div`
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle, rgba(167, 112, 239, 0.1) 0%, rgba(253, 185, 155, 0.05) 50%, transparent 70%);
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
`;

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData = [
    {
      question: "How can I use FinTracker?",
      answer: "Using FinTracker is simple! Just visit our website and explore our market dashboard. Our AI system will provide you with relevant market data, analysis, and personalized investment insights."
    },
    {
      question: "Is my data safe on FinTracker?",
      answer: "Yes, we take data privacy seriously. Your personal information and trading data are treated with the utmost confidentiality. You can review our privacy policy for more details."
    },
    {
      question: "Is FinTracker free to use?",
      answer: "Absolutely! FinTracker is a free resource for all users. We are committed to providing accessible financial tools and market analysis for your investment needs."
    }
  ];

  return (
    <PageWrapper>
      <MainWrapper>
        <SectionHeroHeader>
          <PaddingGlobal>
            <ContainerLarge>
              <PaddingSectionMedium>
                <HeaderComponent>
                  <MarginBottom className="margin-xxlarge">
                    <TextAlignCenter>
                      <MaxWidthLarge>
                        <MarginBottomSmall>
                          <TextColorGradient>FinTracker</TextColorGradient>
                        </MarginBottomSmall>
                        <TextSizeMedium>
                          "Success in the digital world isn't about predicting the future — it's about preparing to adapt faster than anyone else."
                        </TextSizeMedium>
                        <MarginTopMedium>
                          <ButtonGroup>
                            <Button to="/main">
                              <TrendingUp size={24} />
                              Market Dashboard
                            </Button>
                            <Button to="/chatbot" className="is-secondary">
                              <MessageCircle size={24} />
                              AI Assistant
                            </Button>
                          </ButtonGroup>
                        </MarginTopMedium>
                      </MaxWidthLarge>
                    </TextAlignCenter>
                  </MarginBottom>
                </HeaderComponent>
              </PaddingSectionMedium>
            </ContainerLarge>
          </PaddingGlobal>
          <EllipseHero />
        </SectionHeroHeader>

        <SectionLayout>
          <PaddingGlobal>
            <ContainerLarge>
              <PaddingSectionMedium>
                <MarginBottomLarge>
                  <TextAlignCenter>
                    <MaxWidthLarge>
                      <HeadingStyleH3>Explore Financial Markets in Reality</HeadingStyleH3>
                    </MaxWidthLarge>
                  </TextAlignCenter>
                </MarginBottomLarge>
                <LayoutComponent>
                  <LayoutContent>
                    <MarginBottomSmall>
                      <HeadingStyleH3>
                        FinTracker <span style={{color: '#a770ef'}}>a place</span> to learn{' '}
                        <span style={{color: '#fdb99b'}}>a chance</span> to Grow.
                      </HeadingStyleH3>
                    </MarginBottomSmall>
                    <TextSizeMedium>
                      Experience real-time market analysis, advanced charting tools, and comprehensive portfolio tracking 
                      all in one powerful platform designed for modern investors.
                    </TextSizeMedium>
                  </LayoutContent>
                  <LayoutImageWrapper>
                    <div style={{
                      width: '100%',
                      height: '400px',
                      background: 'linear-gradient(135deg, #a770ef 0%, #fdb99b 100%)',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #333a44'
                    }}>
                      <BarChart3 size={80} color="#fefefd" />
                    </div>
                  </LayoutImageWrapper>
                </LayoutComponent>
              </PaddingSectionMedium>
            </ContainerLarge>
          </PaddingGlobal>
        </SectionLayout>

        <SectionLayout>
          <PaddingGlobal>
            <ContainerLarge>
              <PaddingSectionLarge>
                <LayoutComponent style={{gridTemplateColumns: '1fr 1fr'}}>
                  <LayoutImageWrapper style={{order: 1}}>
                    <div style={{
                      width: '100%',
                      height: '400px',
                      background: 'linear-gradient(135deg, #1d2127 0%, #333a44 100%)',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #333a44'
                    }}>
                      <MessageCircle size={80} color="#a770ef" />
                    </div>
                  </LayoutImageWrapper>
                  <LayoutContent style={{order: 2}}>
                    <MarginBottomSmall>
                      <HeadingStyleH3>
                        Unlock the <span style={{color: '#a770ef'}}>power of AI</span> across the web
                      </HeadingStyleH3>
                    </MarginBottomSmall>
                    <TextSizeMedium>
                      Harness intelligent algorithms and machine learning to get personalized investment recommendations, 
                      automated portfolio optimization, and smart trading insights.
                    </TextSizeMedium>
                  </LayoutContent>
                </LayoutComponent>
              </PaddingSectionLarge>
            </ContainerLarge>
          </PaddingGlobal>
        </SectionLayout>

        <SectionUseCase>
          <PaddingGlobal>
            <ContainerLarge>
              <PaddingSectionLarge>
                <UseCaseComponent>
                  <UseCaseContentLeft>
                    <MarginBottomSmall>
                      <HeadingStyleH2>Empowering Financial Success</HeadingStyleH2>
                    </MarginBottomSmall>
                    <TextSizeMedium>
                      A cutting-edge platform meticulously designed to provide seamless financial analysis
                      and elevate the investment experience for every trader and investor.
                    </TextSizeMedium>
                  </UseCaseContentLeft>
                  <UseCaseContentRight>
                    <UseCaseList>
                      <UseCaseItem>
                        <IconWrapper>
                          <TrendingUp size={32} />
                        </IconWrapper>
                        <MarginBottomSmall>
                          <HeadingStyleH5>Live Stock Data</HeadingStyleH5>
                        </MarginBottomSmall>
                        <UseCaseText>
                          Real-time stock prices, charts, and market trends to keep you informed about your investments
                        </UseCaseText>
                      </UseCaseItem>
                      
                      <UseCaseItem>
                        <IconWrapper>
                          <Activity size={32} />
                        </IconWrapper>
                        <MarginBottomSmall>
                          <HeadingStyleH5>Market News</HeadingStyleH5>
                        </MarginBottomSmall>
                        <UseCaseText>
                          Latest financial news and market updates to help you make informed investment decisions
                        </UseCaseText>
                      </UseCaseItem>
                      
                      <UseCaseItem>
                        <IconWrapper>
                          <MessageCircle size={32} />
                        </IconWrapper>
                        <MarginBottomSmall>
                          <HeadingStyleH5>AI Assistant</HeadingStyleH5>
                        </MarginBottomSmall>
                        <UseCaseText>
                          Smart chatbot to answer your financial questions and provide personalized investment insights
                        </UseCaseText>
                      </UseCaseItem>
                      
                      <UseCaseItem>
                        <IconWrapper>
                          <PieChart size={32} />
                        </IconWrapper>
                        <MarginBottomSmall>
                          <HeadingStyleH5>Portfolio Analytics</HeadingStyleH5>
                        </MarginBottomSmall>
                        <UseCaseText>
                          Comprehensive analysis tools to track performance and optimize your investment portfolio
                        </UseCaseText>
                      </UseCaseItem>
                    </UseCaseList>
                  </UseCaseContentRight>
                </UseCaseComponent>
              </PaddingSectionLarge>
            </ContainerLarge>
          </PaddingGlobal>
        </SectionUseCase>

        <VisionSection>
          <PaddingGlobal>
            <ContainerLarge>
              <TextAlignCenter>
                <VisionTitle>Our Vision</VisionTitle>
                <VisionGradientText>
                  Our vision is to revolutionize financial decision-making for everyone.<br />
                  We aim to empower users with real-time data, intelligent insights, and AI-powered tools,<br />
                  making finance accessible, transparent, and actionable.<br />
                  Together, we build a smarter, more confident financial future.
                </VisionGradientText>
              </TextAlignCenter>
            </ContainerLarge>
          </PaddingGlobal>
        </VisionSection>

        <SectionFaq>
          <PaddingGlobal>
            <ContainerSmall>
              <PaddingSectionLarge>
                <MarginBottom className="margin-xxlarge">
                  <TextAlignCenter>
                    <MaxWidthLarge>
                      <MarginBottomSmall>
                        <HeadingStyleH2>What is FinTracker?</HeadingStyleH2>
                      </MarginBottomSmall>
                      <TextSizeMedium>
                        FinTracker stands for Financial Tracker - Advanced Intelligence Platform.
                        It is an AI-powered platform designed to provide comprehensive financial analysis
                        and assist users with their investment and trading decisions.
                      </TextSizeMedium>
                    </MaxWidthLarge>
                  </TextAlignCenter>
                </MarginBottom>
                <FaqComponent>
                  <FaqList>
                    {faqData.map((faq, index) => (
                      <FaqAccordion key={index}>
                        <FaqQuestion onClick={() => toggleFaq(index)}>
                          <FaqQuestionText>{faq.question}</FaqQuestionText>
                          <FaqIcon>{openFaq === index ? '−' : '+'}</FaqIcon>
                        </FaqQuestion>
                        <FaqAnswer className={openFaq === index ? 'open' : ''}>
                          <FaqAnswerContent>
                            <FaqAnswerText>{faq.answer}</FaqAnswerText>
                          </FaqAnswerContent>
                        </FaqAnswer>
                      </FaqAccordion>
                    ))}
                  </FaqList>
                </FaqComponent>
              </PaddingSectionLarge>
            </ContainerSmall>
          </PaddingGlobal>
        </SectionFaq>

        <SectionHeader>
          <PaddingGlobal>
            <ContainerSmall>
              <PaddingSectionMedium>
                <CtaContent>
                  <TextAlignCenter>
                    <MaxWidthXLarge>
                      <MarginBottomSmall>
                        <CtaGradientTitle>
                          Ready to accelerate your financial success with lightning-fast speed?
                        </CtaGradientTitle>
                      </MarginBottomSmall>
                      <TextSizeMedium>
                        A location where you may discover insights to all your questions about financial markets and investment strategies
                      </TextSizeMedium>
                      <MarginTopMedium>
                        <ButtonGroup>
                          <Button to="/main">Get Started</Button>
                        </ButtonGroup>
                      </MarginTopMedium>
                    </MaxWidthXLarge>
                  </TextAlignCenter>
                </CtaContent>
              </PaddingSectionMedium>
            </ContainerSmall>
          </PaddingGlobal>
          <Ellipse />
        </SectionHeader>

        <FooterComponent>
          <PaddingGlobal>
            <ContainerLarge>
              <div style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
                <LineDivider />
                <div style={{ paddingTop: '2rem' }}>
                  <FooterBottomWrapper>
                    <FooterLegalList>
                      <FooterCreditText>
                        Made by <FooterLegalLink href="#" style={{color: '#a770ef'}}>FinTracker Team</FooterLegalLink>
                      </FooterCreditText>
                      <FooterLegalLink href="#">Privacy Policy</FooterLegalLink>
                      <FooterLegalLink href="#">Terms of Service</FooterLegalLink>
                    </FooterLegalList>
                    <FooterSocialIcons>
                      <FooterSocialLink href="#" target="_blank" rel="noopener noreferrer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.566-1.36 2.14-2.23z"/>
                        </svg>
                      </FooterSocialLink>
                      <FooterSocialLink href="#" target="_blank" rel="noopener noreferrer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </FooterSocialLink>
                      <FooterSocialLink href="#" target="_blank" rel="noopener noreferrer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </FooterSocialLink>
                    </FooterSocialIcons>
                  </FooterBottomWrapper>
                </div>
              </div>
            </ContainerLarge>
          </PaddingGlobal>
        </FooterComponent>
      </MainWrapper>
    </PageWrapper>
  );
};

export default LandingPage;