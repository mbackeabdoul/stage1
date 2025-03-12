"use client"
import styled from "styled-components"

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem 0;

   @media (max-width: 768px) {
     padding:  0;
   
  }
`

const MainTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  line-height: 0.9;
  color: #222;
  text-transform: uppercase;
  margin: 0;
  letter-spacing: -1px;

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`

const SubTitle = styled.div`
  margin-top: 1.5rem;
  font-size: 1.25rem;
  color: #333;
`

const Year = styled.div`
  font-size: 1.25rem;
  color: #333;
`

export default function NewCollectionTitle() {
  return (
    <TitleContainer>
      <MainTitle>
        NEW
        <br />
        COLLECTION
      </MainTitle>
      <SubTitle>Summer</SubTitle>
      <Year>2024</Year>
    </TitleContainer>
  )
}

