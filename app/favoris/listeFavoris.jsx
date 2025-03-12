"use client"
import { useState, useEffect } from "react"
import styled from "styled-components"
import Image from "next/image"
import { Plus } from "lucide-react"

const SectionContainer = styled.section`
  padding: 2rem;
  background-color: #f9f9f9;
  margin-top: 1rem;

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const ProductSlider = styled.div`
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
  gap: 15px;
`;

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
`;

const ProductImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 350px;
  background-color: #f5f6fa;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

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
`;

const ProductInfo = styled.div`
  padding: 0.5rem 0;
`;

const ProductCategory = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin: 0.25rem 0;
`;

const ProductPrice = styled.div`
  font-size: 1rem;
  font-weight: 500;
`;

const ColorOptions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ColorVariant = styled.div`
  font-size: 0.75rem;
  color: #999;
  background-color: #f0f0f0;
  padding: 0.1rem 0.3rem;
`;

const Diposition = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const Diposition1 = styled.div`
  display: flex;
  gap: 6px;
  justify-content: space-between;
`;

export default function Listefavoris() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Simuler des données d'API
        const data = [
          { id: 1, image: "/placeholder.svg?height=350&width=300", category: "V-Neck T-Shirt", name: "Embroidered Seersucker Shirt", price: "$99" },
          { id: 2, image: "/placeholder.svg?height=350&width=300", category: "Cotton T-Shirt", name: "Basic Slim Fit T-Shirt", price: "$9.99", variants: "+5" },
          { id: 3, image: "/placeholder.svg?height=350&width=300", category: "Henley T-Shirt", name: "Blurred Print T-Shirt", price: "$99", variants: "+3" },
          { id: 4, image: "/placeholder.svg?height=350&width=300", category: "Crewneck T-Shirt", name: "Full Sleeve Zipper", price: "$99", variants: "+2" },
          { id: 5, image: "/placeholder.svg?height=350&width=300", category: "Polo T-Shirt", name: "Premium Cotton Polo", price: "$79", variants: "+4" },
          { id: 6, image: "/placeholder.svg?height=350&width=300", category: "Graphic T-Shirt", name: "Urban Print Collection", price: "$59", variants: "+2" },
        ];

        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <SectionContainer>Loading products...</SectionContainer>;
  }

  return (
    <SectionContainer>
      <ProductSlider>
        {products.map((product) => (
          <ProductCard key={product.id}>
            <ProductImageContainer>
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                style={{ objectFit: "contain" }}
              />
              <AddButton aria-label="Add to cart">
                <Plus size={24} />
              </AddButton>
            </ProductImageContainer>

            <ProductInfo>
              <Diposition>
                <ProductCategory>{product.category}</ProductCategory>
                {product.variants && (
                  <ColorOptions>
                    <ColorVariant>{product.variants}</ColorVariant>
                  </ColorOptions>
                )}
              </Diposition>

              <Diposition1>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{product.price}</ProductPrice>
              </Diposition1>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductSlider>
    </SectionContainer>
  );
}
