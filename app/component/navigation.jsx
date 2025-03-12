"use client"
import styled from "styled-components"

const NavContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  width: 100%;
  background-color: #fafafa;
  position: relative;
  padding: 4rem;

    @media (max-width: 600px) {
  padding: 1rem;
`

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6rem;

    @media (max-width: 600px) {
    gap: 3rem;
  
`

const SectionTitle = styled.h2`
  font-size: 0.75rem;
  color: #888;
  font-weight: 300;
  margin-bottom: 2.5rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`

const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const StyledLink = styled.a`
  color: #888;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 300;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  
  &:after {
    content: '/';
    margin: 0 0.5rem;
    color: #888;
    font-weight: 200;
  }
  
  &:last-child:after {
    display: none;
  }
`

const CenterSection = styled.div`
  display: flex;
  flex-direction: column;
  
  position: relative;
`

const TopBar = styled.div`
  font-size: 0.75rem;
  color: #888;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1.5rem;
`

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;

`

const ArrowAndVR = styled.div`
  position: relative;
 
  display: flex;
  align-items: center;
`

const DiamondShape = styled.div`
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.05);
  transform: rotate(45deg);
  position: absolute;
  left: 0;
  z-index: 0;

    @media (max-width: 600px) {
        width: 30px;
  height: 30px;
  }
`

const LogoArrow = styled.div`
  width: 0;
  height: 0;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-left: 30px solid #000;
  position: relative;
  z-index: 1;

  
`

const FadedText = styled.div`
  font-size: 6rem;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.04);
  text-transform: uppercase;
 
    @media (max-width: 600px) {
    font-size: 3rem;
  }

`

const LogoAndCommunication = styled.div`
  display: flex;
  align-items: center;
`

const LogoText = styled.div`
  font-size: 6rem;
  font-weight: 700;
  line-height: 0.85;
  letter-spacing: -0.02em;
  color: #000;
  z-index: 1;
  position: relative;

    @media (max-width: 600px) {
    font-size: 3rem;
  }
`

const CommunicationText = styled.div`
  color: #888;
  font-size: 0.75rem;
  font-weight: 300;
  letter-spacing: 0.05em;
  white-space: nowrap;
  display: flex;
  align-items: center;
  margin-left: 1.5rem;
  
  &:after {
    content: '/';
    margin-left: 0.5rem;
    color: #888;
    font-weight: 200;
  }

    @media (max-width: 600px) {
    margin-left: 0.5rem;
  }

`

export default function Navigation() {
  return (
    <NavContainer>
      <LeftSection>
        <div>
          <SectionTitle>INFO</SectionTitle>
          <LinkList>
            <StyledLink href="/pricing">PRICING</StyledLink>
            <StyledLink href="/about">ABOUT</StyledLink>
            <StyledLink href="/contacts">CONTACTS</StyledLink>
          </LinkList>
        </div>
        <div>
          <SectionTitle>LANGUAGES</SectionTitle>
          <LinkList>
            <StyledLink href="/lang/eng">ENG</StyledLink>
            <StyledLink href="/lang/esp">ESP</StyledLink>
            <StyledLink href="/lang/sve">SVE</StyledLink>
          </LinkList>
        </div>
      </LeftSection>

      <CenterSection>
        <TopBar>TECHNOLOGIES</TopBar>

        <LogoContainer>

          <ArrowAndVR>
            <DiamondShape />
            <LogoArrow />
            <FadedText>VR</FadedText>
          </ArrowAndVR>
    
          <LogoAndCommunication>
            <LogoText>
              XIV
              <br />
              QR
            </LogoText>
            <CommunicationText>Near-field communication</CommunicationText>
          </LogoAndCommunication>
          
        </LogoContainer>

        
      </CenterSection>
    </NavContainer>
  )
}

