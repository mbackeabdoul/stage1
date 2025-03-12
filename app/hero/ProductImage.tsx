"use client"
import styled from "styled-components"
import Image from "next/image"

interface ProductImageProps {
  src: string
  alt: string
}

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 450px;
  border: 1px solid #eee;
  background-color: white;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 350px;
    border: none;
  }
`

// Modifié pour éviter les problèmes avec styled(Image)
const StyledImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

export default function ProductImage({ src, alt }: ProductImageProps) {
  // Vérifier si l'URL est valide
  const imageSrc = src && src.startsWith("http") ? src : "/placeholder.svg"

  return (
    <ImageContainer>
      <StyledImageWrapper>
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          style={{ objectFit: "cover" }}
        />
      </StyledImageWrapper>
    </ImageContainer>
  )
}

