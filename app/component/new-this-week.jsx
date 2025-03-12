"use client"
import { useState, useEffect } from "react"
import styled from "styled-components"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { fetchProduct } from "../lib/api"

const SectionContainer = styled.section`
  padding: 2rem;
  background-color: #f9f9f9;
  margin-top: 1rem;

  @media (max-width: 600px) {
    padding: 1rem;
  }
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`

const Title = styled.h2`
  font-size: 3.5rem;
  font-weight: 900;
  text-transform: uppercase;
  line-height: 1;
  margin: 0;
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const CountBadge = styled.span`
  font-size: 1.25rem;
  color: #3a3af4;
  margin-left: 0.5rem;
`

const SeeAllLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-size: 1rem;
  padding-top: 70px
`

const SliderContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
`

const ProductSlider = styled.div`
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
  gap: 15px;
  transform: ${(props) => props.transform};
`

const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f6fa;
  border: 1px solid #eee;
  flex: 0 0 25%;
  gap: 10px;
  
  @media (max-width: 1200px) {
    flex: 0 0 33.333%;
  }
  
  @media (max-width: 768px) {
    flex: 0 0 50%;
  }
  
  @media (max-width: 480px) {
    flex: 0 0 100%;
  }
`

const ProductImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 350px;
  background-color: #f5f6fa;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px
`

const AddButton = styled.button`
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ProductInfo = styled.div`
  padding: 0.5rem 0;
`

const ProductCategory = styled.div`
  font-size: 0.875rem;
  color: #666;
`

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin: 0.25rem 0;
`

const ProductPrice = styled.div`
  font-size: 1rem;
  font-weight: 500;
`

const ColorOptions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const ColorVariant = styled.div`
  font-size: 0.75rem;
  color: #999;
  background-color: #f0f0f0;
  padding: 0.1rem 0.3rem;
`

const NavigationControls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`

const Diposition = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`

const Diposition1 = styled.div`
  display: flex;
  gap: 6px;
  justify-content: space-between;
`

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  transition: all 0.2s ease;
  margin: 0 0.25rem;

  &:hover {
    border-color: ${(props) => (props.disabled ? "#ddd" : "#999")};
  }
`

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #333;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

export default function NewThisWeek() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(4)

  // Determine items per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setItemsPerView(1)
      } else if (window.innerWidth <= 768) {
        setItemsPerView(2)
      } else if (window.innerWidth <= 1200) {
        setItemsPerView(3)
      } else {
        setItemsPerView(4)
      }
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Fetch products from API
  useEffect(() => {
    const fetchNewProduct = async () => {
      setLoading(true)
      try {
        // Fetch newest products
        const data = await fetchProduct({
          limit: 10,
          sort: "newest",
        })

        setProducts(data.products)
      } catch (error) {
        console.error("Error fetching new products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNewProduct()
  }, [])

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - itemsPerView))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(products.length - itemsPerView, prevIndex + itemsPerView))
  }

  // Calculate if buttons should be disabled
  const isPrevDisabled = currentIndex === 0
  const isNextDisabled = currentIndex >= products.length - itemsPerView

  // Calculate the transform value for the slider
  const sliderTransform = `translateX(-${currentIndex * (100 / itemsPerView)}%)`

  // Add to cart function
  const addToCart = (productId) => {
    console.log(`Adding product ${productId} to cart`)
    // Implement cart functionality
  }

  if (loading) {
    return (
      <SectionContainer>
        <SectionHeader>
          <Title>
            NEW <br />
            THIS WEEK
          </Title>
        </SectionHeader>
        <LoadingSpinner />
      </SectionContainer>
    )
  }

  return (
    <SectionContainer>
      <SectionHeader>
        <Title>
          NEW <br />
          THIS WEEK
          <CountBadge>({products.length})</CountBadge>
        </Title>

        <SeeAllLink href="/collections/new">See All</SeeAllLink>
      </SectionHeader>

      <SliderContainer>
        <ProductSlider transform={sliderTransform}>
          {products.map((product) => (
            <ProductCard key={product._id}>
              <ProductImageContainer>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  style={{ objectFit: "contain" }}
                />
                <AddButton aria-label="Add to cart" onClick={() => addToCart(product._id)}>
                  <Plus size={24} />
                </AddButton>
              </ProductImageContainer>

              <ProductInfo>
                <Diposition>
                  <ProductCategory>{product.category}</ProductCategory>
                  {product.color && (
                    <ColorOptions>
                      <ColorVariant>{product.color}</ColorVariant>
                    </ColorOptions>
                  )}
                </Diposition>

                <Diposition1>
                  <ProductName>{product.name}</ProductName>
                  <ProductPrice>{product.price}€</ProductPrice>
                </Diposition1>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductSlider>
      </SliderContainer>

      <NavigationControls>
        <NavButton aria-label="Previous page" onClick={handlePrevious} disabled={isPrevDisabled}>
          <ChevronLeft size={20} />
        </NavButton>
        <NavButton aria-label="Next page" onClick={handleNext} disabled={isNextDisabled}>
          <ChevronRight size={20} />
        </NavButton>
      </NavigationControls>
    </SectionContainer>
  )
}

