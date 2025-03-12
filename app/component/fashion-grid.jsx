"use client"
import { Gallery, ImageContainer, Image } from "./stylr"

const FashionGrid = () => {
  // Structure de données avec le chemin de l'image et sa classe CSS
  const images = [
    { src: "/image1.jpg", className: "image-left" },
    { src: "/image2.jpg", className: "image-center" },
    { src: "/image3.jpg", className: "image-right" },
    { src: "/image4.jpg", className: "image-far-right" },
  ]

  return (
    <Gallery>
      {images.map((image, index) => (
        <ImageContainer key={index} className={image.className}>
          <Image src={image.src || "/placeholder.svg"} alt={`Fashion image ${index + 1}`} loading="lazy" />
        </ImageContainer>
      ))}
    </Gallery>
  )
}

export default FashionGrid

