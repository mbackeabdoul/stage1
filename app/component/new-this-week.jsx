"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { fetchProduct } from "../lib/api";

// Main section container with a subtle gradient
const SectionContainer = styled.section`
  padding: 2.5rem 1.5rem;
  background: linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%);
  margin-top: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 600px) {
    padding: 1.5rem 1rem;
    margin-top: 1rem;
  }
`;

// Header with flexbox for alignment
const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

// Bold, modern title with a subtle animation
const Title = styled.h2`
  font-size: 3.5rem;
  font-weight: 900;
  text-transform: uppercase;
  line-height: 1.1;
  margin: 0;
  color: #1a1a1a;
  transition: color 0.3s ease;

  &:hover {
    color: #3a3af4;
  }

  @media (max-width: 768px) {
    font-size: 2.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

// Stylish count badge with a circular design
const CountBadge = styled.span`
  font-size: 1.25rem;
  color: #ffffff;
  background-color: #3a3af4;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.75rem;
`;

// Sleek "See All" link with hover effect
const SeeAllLink = styled(Link)`
  text-decoration: none;
  color: #3a3af4;
  font-size: 1.125rem;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #1a1af4;
    text-decoration: underline;
  }
`;

// Slider container with smooth overflow handling
const SliderContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 0 1rem;
`;

// Product slider with smooth transitions
const ProductSlider = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: 100%;
  gap: 20px;
  transform: ${(props) => props.transform};
`;

// Modern product card with hover effect
const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  flex: 0 0 25%;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 1200px) {
    flex: 0 0 33.333%;
  }

  @media (max-width: 768px) {
    flex: 0 0 50%;
  }

  @media (max-width: 480px) {
    flex: 0 0 100%;
  }
`;

// Image container with consistent sizing
const ProductImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 350px;
  background-color: #f5f6fa;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Add button with a modern circular design
const AddButton = styled.button`
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: #3a3af4;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1a1af4;
  }
`;

// Product info with clean padding
const ProductInfo = styled.div`
  padding: 1rem;
`;

// Subtle category text
const ProductCategory = styled.div`
  font-size: 0.875rem;
  color: #666;
  text-transform: uppercase;
`;

// Bold product name
const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0.5rem 0;
  color: #1a1a1a;
`;

// Price with a standout color
const ProductPrice = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #3a3af4;
`;

// Flex container for alignment
const Disposition = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

// Flex container for justified content
const Disposition1 = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
  align-items: center;
`;

// Color options with a sleek look
const ColorOptions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ColorVariant = styled.div`
  font-size: 0.75rem;
  color: #666;
  background-color: #f0f0f0;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
`;

// Navigation controls with a modern touch
const NavigationControls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
  gap: 1rem;
`;

// Styled navigation button
const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 1px solid #ddd;
  background-color: #ffffff;
  border-radius: 50%;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    border-color: #3a3af4;
    color: #3a3af4;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

// Enhanced loading spinner
const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3a3af4;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 2rem auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default function NewThisWeek() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setItemsPerView(width <= 480 ? 1 : width <= 768 ? 2 : width <= 1200 ? 3 : 4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchNewProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProduct({ limit: 10, sort: "newest" });
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching new products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewProduct();
  }, []);

  const handlePrevious = () => setCurrentIndex((prev) => Math.max(0, prev - itemsPerView));
  const handleNext = () => setCurrentIndex((prev) => Math.min(products.length - itemsPerView, prev + itemsPerView));

  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex >= products.length - itemsPerView;
  const sliderTransform = `translateX(-${currentIndex * (100 / itemsPerView)}%)`;

  const addToCart = (productId) => {
    console.log(`Adding product ${productId} to cart`);
    // Add cart logic here
  };

  if (loading) {
    return (
      <SectionContainer>
        <SectionHeader>
          <Title>
            NEW <br /> THIS WEEK
          </Title>
        </SectionHeader>
        <LoadingSpinner />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <SectionHeader>
        <Title>
          NEW <br /> THIS WEEK <CountBadge>{products.length}</CountBadge>
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
                <Disposition>
                  <ProductCategory>{product.category}</ProductCategory>
                  {product.color && (
                    <ColorOptions>
                      <ColorVariant>{product.color}</ColorVariant>
                    </ColorOptions>
                  )}
                </Disposition>
                <Disposition1>
                  <ProductName>{product.name}</ProductName>
                  <ProductPrice>{product.price}€</ProductPrice>
                </Disposition1>
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
  );
}