import styled from "styled-components"

export const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr;
  grid-gap: 40px;
  background-color: transparent;
  width: 100%;
  max-width: 1400px;
  margin-left: 30px;
  position: relative;
  min-height: 500px;
  
  /* Tablette - Affichage en 2 colonnes */
  @media (max-width: 768px) and (min-width: 401px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, auto);
    grid-gap: 30px;
    padding: 30px 15px;
    margin-left: 0px;
  }

  /* Mobile - Affichage en 1 colonne */
  @media (max-width: 400px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto);
    grid-gap: 20px;
    padding: 20px 10px;
    margin-left: 0px;
  }
`

export const ImageContainer = styled.div`
  border-radius: 2px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  
  &.image-left {
    grid-column: 1 / span 3;
    grid-row: 1;
    height: 450px;
    
    /* Tablette - 2 colonnes */
    @media (max-width: 768px) and (min-width: 401px) {
      grid-column: 1;
      grid-row: 1;
      height: 400px;
    }
    
    /* Mobile - 1 colonne */
    @media (max-width: 400px) {
      grid-column: 1;
      grid-row: 1;
      height: 350px;
    }
  }
  
  &.image-center {
    grid-column: 4 / span 3;
    grid-row: 1;
    margin-top: 70px;
    height: 500px;
    
    /* Tablette - 2 colonnes */
    @media (max-width: 768px) and (min-width: 401px) {
      grid-column: 2;
      grid-row: 1;
      margin-top: 70px;
      height: 400px;
    }
    
    /* Mobile - 1 colonne */
    @media (max-width: 400px) {
      grid-column: 1;
      grid-row: 2;
      margin-top: 0;
      height: 350px;
    }
  }
  
  &.image-right {
    grid-column: 7 / span 3;
    grid-row: 1;
    height: 450px;
    
    /* Tablette - 2 colonnes */
    @media (max-width: 768px) and (min-width: 401px) {
      grid-column: 1;
      grid-row: 2;
      height: 400px;
    }
    
    /* Mobile - 1 colonne */
    @media (max-width: 400px) {
      grid-column: 1;
      grid-row: 3;
      height: 350px;
    }
  }
  
  &.image-far-right {
    grid-column: 10 / span 3;
    grid-row: 1;
    margin-top: 70px;
    height: 400px;
    
    /* Tablette - 2 colonnes */
    @media (max-width: 768px) and (min-width: 401px) {
      grid-column: 2;
      grid-row: 2;
      margin-top: 70px;
      height: 400px;
    }
    
    /* Mobile - 1 colonne */
    @media (max-width: 400px) {
      grid-column: 1;
      grid-row: 4;
      margin-top: 0;
      height: 350px;
    }
  }
`

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.03);
  }
`

