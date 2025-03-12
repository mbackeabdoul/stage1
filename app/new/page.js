"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";

export default function NewProducts() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setIsLoading(true);
        const token = sessionStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/products?sort=latest", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Échec de la récupération des derniers produits");
        const data = await response.json();
        setLatestProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setError(error.message);
        setIsLoading(false);
      }
    };
    fetchLatestProducts();
  }, []);

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Chargement des nouveaux produits...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorText>{error}</ErrorText>
      </ErrorContainer>
    );
  }

  return (
    <Container>
      <Title>Derniers Produits</Title>
      {latestProducts.length === 0 ? (
        <EmptyMessage>Aucun nouveau produit disponible pour le moment.</EmptyMessage>
      ) : (
        <ProductGrid>
          {latestProducts.map((product) => (
            <ProductCard key={product._id}>
              <Link href={`/details?id=${product._id}`} passHref>
                <ProductLink>
                  <ProductImage src={product.image || "/placeholder.svg"} alt={product.name} />
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>${product.price}</ProductPrice>
                  </ProductInfo>
                </ProductLink>
              </Link>
            </ProductCard>
          ))}
        </ProductGrid>
      )}
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Inter", sans-serif;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 2rem;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
`;

const ProductCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
`;

const ProductLink = styled.a`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-bottom: 1px solid #eee;

  @media (max-width: 768px) {
    height: 200px;
  }
`;

const ProductInfo = styled.div`
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProductName = styled.p`
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ProductPrice = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: #3a3af4;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const EmptyMessage = styled.p`
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  padding: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 1rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3a3af4;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
  color: #666;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;

const ErrorText = styled.p`
  font-size: 1.2rem;
  color: #e53935;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;