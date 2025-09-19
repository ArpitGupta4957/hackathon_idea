import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Styled Components
const PageWrapper = styled.div`
  background-color: #181b20;
  color: #fefefd;
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
`;

const NavbarComponent = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  background-color: rgba(24, 27, 32, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
  padding: 1rem 0;
`;

const NavbarContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
`;

const NavbarLogo = styled.img`
  width: 112px;
  height: auto;
`;

const NavbarMenu = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavbarLink = styled(Link)`
  color: #fefefd;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #a770ef;
  }
`;

const Button = styled(Link)`
  background: linear-gradient(135deg, #a770ef 0%, #fdb99b 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const MainWrapper = styled.main`
  padding-top: 100px;
`;

const SectionHeroHeader = styled.header`
  padding: 6rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const TextColorGradient = styled.h1`
  background: linear-gradient(135deg, #a770ef 0%, #fdb99b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 4.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const TextSizeMedium = styled.p`
  font-size: 1.875rem;
  line-height: 1.6;
  color: #b8bcc8;
  max-width: 800px;
  margin: 0 auto 4rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const HeroImageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const HeroImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const SectionAboutStory = styled.section`
  padding: 6rem 2rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const AboutStoryComponent = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  align-items: start;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const AboutStoryContentLeft = styled.div``;

const StoryLabel = styled.div`
  color: #a770ef;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
`;

const StoryTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  color: #fefefd;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const TimelineWrapper = styled.div`
  position: relative;
`;

const TimelineStep = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 29px;
    top: 60px;
    width: 2px;
    height: calc(100% + 1rem);
    background: linear-gradient(180deg, #a770ef 0%, #fdb99b 100%);
  }
`;

const TimelineIconWrapper = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #a770ef 0%, #fdb99b 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
`;

const TimelineIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const TimelineContent = styled.div``;

const TimelineDate = styled.div`
  color: #a770ef;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const TimelineHeading = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #fefefd;
  margin-bottom: 1rem;
`;

const TimelineDescription = styled.p`
  color: #b8bcc8;
  line-height: 1.6;
`;

const SectionAboutTeam = styled.section`
  padding: 6rem 2rem;
`;

const TeamTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  color: #fefefd;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const TeamDescription = styled.p`
  font-size: 1.25rem;
  color: #b8bcc8;
  line-height: 1.6;
  max-width: 800px;
  margin-bottom: 4rem;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
`;

const TeamMember = styled.div`
  text-align: center;
  padding: 2rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(167, 112, 239, 0.2);
  }
`;

const TeamImageWrapper = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #a770ef 0%, #fdb99b 100%);
  padding: 3px;
`;

const TeamImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: #181b20;
`;

const TeamName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #fefefd;
  margin-bottom: 1rem;
`;

const TeamRole = styled.p`
  color: #b8bcc8;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #a770ef 0%, #fdb99b 100%);
  }
`;

const SocialIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const FooterComponent = styled.footer`
  background: #0f1114;
  padding: 4rem 2rem 2rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FooterColumn = styled.div``;

const FooterLogo = styled.img`
  width: 112px;
  margin-bottom: 1rem;
`;

const FooterDescription = styled.p`
  color: #b8bcc8;
  line-height: 1.6;
`;

const FooterTitle = styled.h4`
  color: #fefefd;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FooterLink = styled.a`
  display: block;
  color: #b8bcc8;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #a770ef;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Copyright = styled.div`
  color: #b8bcc8;
  font-size: 0.875rem;
`;

const FinTrackerAbout = () => {
  const teamMembers = [
    {
      name: "Siddhant Koochar",
      role: "Siddhant is our technical lead and full-stack developer, bringing innovative solutions to complex financial data management challenges with a focus on scalability and performance.",
      image: "/sidd.jpg",
      linkedin: "https://linkedin.com/in/siddhant-kochhar",
      email: "siddhant@gmail.com"
    },
    {
      name: "Arpit Gupta",
      role: "Arpit specializes in frontend development and user interface design, crafting intuitive experiences that make complex financial data easy to understand and interact with.",
      image: "/ic3-removebg-preview.png",
      linkedin: "https://www.linkedin.com/in/arpit-gupta-95b5a2250/",
      email: "arpit@gmail.com"
    },
    {
      name: "Kush Saini",
      role: "Kush is our backend architect and data security specialist, ensuring that your financial information is processed efficiently while maintaining the highest standards of privacy and security.",
      image: "/kush.jpg",
      linkedin: "https://www.linkedin.com/in/kush-sainii/",
      email: "kush@gmail.com"
    }
  ];

  const timelineSteps = [
    {
      date: "2025 • Q1",
      title: "The Spark of Innovation",
      description: "Recognizing the complexity of personal finance management, our team came together with a shared vision to create an intuitive, powerful solution that makes financial tracking accessible to everyone.",
      icon: "https://assets.website-files.com/649fc0a4ab26229b177049b2/64aba666c4619524064ea0a3_edit_note-min.png"
    },
    {
      date: "2025 • Q2",
      title: "Research and User Discovery",
      description: "We conducted extensive research into user pain points, financial habits, and existing solutions to understand what truly matters in personal finance management.",
      icon: "https://assets.website-files.com/649fc0a4ab26229b177049b2/64aba8a9480a5f17c03fb37d_Team.png"
    },
    {
      date: "2025 • Q3",
      title: "Building the Foundation",
      description: "From wireframes to working prototypes, we meticulously crafted each feature with user experience at the forefront, ensuring every interaction feels natural and purposeful.",
      icon: "https://assets.website-files.com/649fc0a4ab26229b177049b2/64aba8a9752f2e9019ef9b74_Prototype.png"
    },
    {
      date: "2025 • Q4",
      title: "Launch and Continuous Innovation",
      description: "Today, FinTracker stands as a testament to our commitment to empowering users with smart financial tools, and we continue to evolve based on user feedback and emerging technologies.",
      icon: "https://assets.website-files.com/649fc0a4ab26229b177049b2/64aba8aa480a17e27cbd01d7_Trophy.png"
    }
  ];

  return (
    <PageWrapper>
      {/* Navigation */}
      <NavbarComponent>
        <NavbarContainer>

          <NavbarMenu>
            <NavbarLink to="/">Home</NavbarLink>
            <Button to="/main">Get Started</Button>
          </NavbarMenu>
        </NavbarContainer>
      </NavbarComponent>

      <MainWrapper>
        {/* Hero Section */}
        <SectionHeroHeader>
          <TextColorGradient>
            Empowering Smart Financial Decisions
          </TextColorGradient>
          <TextSizeMedium>
            Meet the passionate team behind FinTracker - dedicated developers and innovators working together to revolutionize personal finance management through cutting-edge technology and user-centered design.
          </TextSizeMedium>
          <HeroImageWrapper>
            <HeroImage 
              src="https://assets.website-files.com/649fc0a4ab26229b177049b2/64af8ceddad9a28e34ef9b07_About_Header.jpg"
              alt="FinTracker Team"
            />
          </HeroImageWrapper>
        </SectionHeroHeader>

        {/* Our Story Section */}
        <SectionAboutStory>
          <Container>
            <AboutStoryComponent>
              <AboutStoryContentLeft>
                <StoryLabel>Our story</StoryLabel>
                <StoryTitle>The journey of building a smarter way to manage finances...</StoryTitle>
              </AboutStoryContentLeft>
              <TimelineWrapper>
                {timelineSteps.map((step, index) => (
                  <TimelineStep key={index}>
                    <TimelineIconWrapper>
                      <TimelineIcon src={step.icon} alt="Timeline Icon" />
                    </TimelineIconWrapper>
                    <TimelineContent>
                      <TimelineDate>{step.date}</TimelineDate>
                      <TimelineHeading>{step.title}</TimelineHeading>
                      <TimelineDescription>{step.description}</TimelineDescription>
                    </TimelineContent>
                  </TimelineStep>
                ))}
              </TimelineWrapper>
            </AboutStoryComponent>
          </Container>
        </SectionAboutStory>

        {/* Team Section */}
        <SectionAboutTeam>
          <Container>
            <TeamTitle>Meet our FinTracker Crew</TeamTitle>
            <TeamDescription>
              Our diverse team brings together expertise in software development, user experience design, and financial technology. We're united by our passion for creating tools that make financial management both powerful and accessible.
            </TeamDescription>
            <TeamGrid>
              {teamMembers.map((member, index) => (
                <TeamMember key={index}>
                  <TeamImageWrapper>
                    <TeamImage src={member.image} alt={member.name} />
                  </TeamImageWrapper>
                  <TeamName>{member.name}</TeamName>
                  <TeamRole>{member.role}</TeamRole>
                  <SocialLinks>
                    <SocialLink href={member.linkedin}>
                      <SocialIcon 
                        src="https://assets.website-files.com/649fc0a4ab26229b177049b2/64ab8cb980dc875e2054fac5_LinkedIn.png"
                        alt="LinkedIn"
                      />
                    </SocialLink>
                    <SocialLink href={`mailto:${member.email}`}>
                      <SocialIcon 
                        src="https://assets.website-files.com/649fc0a4ab26229b177049b2/64abc152e317ed2dfb628b22_Email.png"
                        alt="Email"
                      />
                    </SocialLink>
                  </SocialLinks>
                </TeamMember>
              ))}
            </TeamGrid>
          </Container>
        </SectionAboutTeam>
      </MainWrapper>

      {/* Footer */}
      <FooterComponent>
        <Container>
          <FooterGrid>
            <FooterColumn>
              <FooterLogo src="vit-gpt_logo.png" alt="FinTracker Logo" />
              <FooterDescription>
                Empowering smart financial decisions through innovative technology and user-centered design.
              </FooterDescription>
            </FooterColumn>
            <FooterColumn>
              <FooterTitle>Product</FooterTitle>
              <FooterLink href="#">Features</FooterLink>
              <FooterLink href="#">Pricing</FooterLink>
              <FooterLink href="#">Security</FooterLink>
              <FooterLink href="#">API</FooterLink>
            </FooterColumn>
            <FooterColumn>
              <FooterTitle>Company</FooterTitle>
              <FooterLink href="#">About</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </FooterColumn>
            <FooterColumn>
              <FooterTitle>Support</FooterTitle>
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Status</FooterLink>
            </FooterColumn>
          </FooterGrid>
          <FooterBottom>
            <Copyright>© 2024 FinTracker. All rights reserved.</Copyright>
            <SocialLinks>
              <SocialLink href="#">
                <SocialIcon 
                  src="https://assets.website-files.com/649fc0a4ab26229b177049b2/64ab8cb980dc875e2054fac5_LinkedIn.png"
                  alt="LinkedIn"
                />
              </SocialLink>
              <SocialLink href="#">
                <SocialIcon 
                  src="https://assets.website-files.com/649fc0a4ab26229b177049b2/64abc152e317ed2dfb628b22_Email.png"
                  alt="Email"
                />
              </SocialLink>
            </SocialLinks>
          </FooterBottom>
        </Container>
      </FooterComponent>
    </PageWrapper>
  );
};

export default FinTrackerAbout;