"use client"
import { useState, useEffect } from "react"
import styled from "styled-components"
import NewCollectionTitle from "./NewCollectionTitle"
import ProductImage from "./ProductImage"
import ShopButton from "./ShopButton"
import CarouselNavigation from "./CarouselNavigation"

// Définition de l'interface Product directement dans le composant
interface Product {
  id: number
  title: string
  price: number
  image: string
  category: string
  description?: string
}

const HeroContainer = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  background-color: #f9f9f9;
  margin-top: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 768px) {
    display: block;
    padding: 1.5rem;
    background-color: #f5f5f5;
  }
`

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`

const CenterSection = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    display: none;
  }
`

const RightSection = styled.div`
  @media (max-width: 1024px) {
    grid-column: 1;
    grid-row: 1;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const NavigationWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    display: none;
  }
`

// Mobile specific components
const MobileView = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`

const ProductsScroll = styled.div`
  margin: 0 -1.5rem;
  padding: 0 1.5rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`

const ProductGrid = styled.div`
  display: flex;
  gap: 1rem;
  width: max-content;
`

const ProductCard = styled.div`
  width: 280px;
`

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
`

const ProductCategory = styled.div`
  color: #666;
  font-size: 0.875rem;
`

const ProductDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #000;
  font-size: 0.875rem;
`

const ProductName = styled.span`
  font-weight: 400;
`

const ProductPrice = styled.span`
  font-weight: 400;
`

// Sample product data
const sampleProducts = [
  {
    id: 1,
    image: "/placeholder.svg",
    category: "Cotton T Shirt",
    name: "Full Sleeve Zipper",
    price: "199",
  },
  {
    id: 2,
    image: "/placeholder.svg",
    category: "Cotton T Shirt",
    name: "Full Sleeve Zipper",
    price: "199",
  },
  {
    id: 3,
    image: "/placeholder.svg",
    category: "Cotton T Shirt",
    name: "Full Sleeve Zipper",
    price: "199",
  },
]

// Fonction fetchProducts intégrée directement dans le composant
async function fetchProductsData(limit = 6): Promise<Product[]> {
  try {
    const response = await fetch(`https://fakestoreapi.com/products?limit=${limit}`)
    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching products:", error)
    // Retourner un tableau de produits par défaut en cas d'erreur
    return [
      {
        id: 1,
        title: "Product 1",
        price: 199,
        image: "/placeholder.svg",
        category: "Cotton T Shirt",
        description: "Description",
      },
      {
        id: 2,
        title: "Product 2",
        price: 299,
        image: "/placeholder.svg",
        category: "Cotton T Shirt",
        description: "Description",
      },
      {
        id: 3,
        title: "Product 3",
        price: 399,
        image: "/placeholder.svg",
        category: "Cotton T Shirt",
        description: "Description",
      },
    ]
  }
}

export default function NewCollectionHero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        const data = await fetchProductsData(6)
        setProducts(data)
      } catch (error) {
        console.error("Error loading products:", error)
        // Fallback to sample products if API fails
        setProducts(sampleProducts as unknown as Product[])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1))
  }

  if (loading) {
    return <HeroContainer>Loading...</HeroContainer>
  }

  return (
    <HeroContainer>
      {/* Desktop/Laptop Layout */}
      <LeftSection>
        <NewCollectionTitle />

        <Pagination>
          <ShopButton />
          <NavigationWrapper>
            <CarouselNavigation onPrevious={handlePrevious} onNext={handleNext} />
          </NavigationWrapper>
        </Pagination>
      </LeftSection>

      <CenterSection>
        <ProductImage
          src={products[currentIndex]?.image || "/placeholder.svg"}
          alt={products[currentIndex]?.title || "Product image"}
        />
      </CenterSection>

      <RightSection>
        <ProductImage src={products[1]?.image || "/placeholder.svg"} alt={products[1]?.title || "Product image"} />
      </RightSection>

      {/* Mobile Layout */}
      <MobileView>
        <ProductsScroll>
          <ProductGrid>
            {sampleProducts.map((product) => (
              <ProductCard key={product.id}>
                <ProductImage src={product.image} alt={product.name} />
                <ProductInfo>
                  <ProductCategory>{product.category}</ProductCategory>
                  <ProductDetails>
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>${product.price}</ProductPrice>
                  </ProductDetails>
                </ProductInfo>
              </ProductCard>
            ))}
          </ProductGrid>
        </ProductsScroll>

        <ShopButton />
      </MobileView>
    </HeroContainer>
  )
}

