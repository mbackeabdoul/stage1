"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // Import corrigé
import { toast } from "react-hot-toast";

const SectionContainer = styled.section`
  padding: 2rem;
  background-color: #f9f9f9;
  margin-top: 1rem;
  min-height: 50vh;

  @media (max-width: 600px) {
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
  }
`;

const ProductSlider = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
`;

const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex: 0 0 25%;
  max-width: 25%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 1200px) {
    flex: 0 0 33.333%;
    max-width: 33.333%;
  }

  @media (max-width: 768px) {
    flex: 0 0 50%;
    max-width: 50%;
  }

  @media (max-width: 480px) {
    flex: 0 0 100%;
    max-width: 100%;
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  background-color: #f5f6fa;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    height: 250px;
  }
`;

const ProductLink = styled.a`
  text-decoration: none;
  color: inherit;
`;

const AddButton = styled.button`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: #3a3af4;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;

  &:hover {
    background: #1a1af4;
  }
`;

const ProductInfo = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ProductCategory = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  line-height: 1.4;
`;

const ProductPrice = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #3a3af4;
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
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
`;

const Disposition = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const Disposition1 = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
`;

const EmptyMessage = styled.p`
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  padding: 2rem;
`;

export default function Listefavoris() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false); // Pas de chargement initial
  const router = useRouter();
  const searchParams = useSearchParams(); // Maintenant correctement importé
  const showFavorites = searchParams.get("show") === "true";

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const user = sessionStorage.getItem("user");

      if (!token || !user) {
        router.push("/login?callbackUrl=/favoris");
        return;
      }

      const userId = JSON.parse(user)._id;
      const response = await fetch(`http://localhost:5000/api/favorites?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          router.push("/login?callbackUrl=/favoris");
          return;
        }
        throw new Error("Échec de la récupération des favoris");
      }

      const data = await response.json();
      setFavorites(data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des favoris:", error);
      toast.error("Erreur lors de la récupération des favoris");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showFavorites) {
      fetchFavorites(); // Récupérer uniquement si ?show=true
    }
  }, [showFavorites]);

  const handleAddToCart = (product) => {
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image || "/placeholder.svg",
      quantity: 1,
    };

    let cartItems = [];
    try {
      const existingCart = localStorage.getItem("cartItems");
      if (existingCart) {
        cartItems = JSON.parse(existingCart);
        const existingItemIndex = cartItems.findIndex((item) => item.id === cartItem.id);
        if (existingItemIndex >= 0) {
          cartItems[existingItemIndex].quantity += 1;
        } else {
          cartItems.push(cartItem);
        }
      } else {
        cartItems = [cartItem];
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      toast.success("Produit ajouté au panier");
      router.push(`/checkout?productId=${cartItem.id}`);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      toast.error("Erreur lors de l'ajout au panier");
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Chargement de vos favoris...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <SectionContainer>
      <Title>Vos Favoris</Title>
      {showFavorites ? (
        favorites.length === 0 ? (
          <EmptyMessage>Aucun produit dans vos favoris pour le moment.</EmptyMessage>
        ) : (
          <ProductSlider>
            {favorites.map((product) => (
              <ProductCard key={product._id}>
                <Link href={`/details?id=${product._id}`} passHref>
                  <ProductLink>
                    <ProductImageContainer>
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        style={{ objectFit: "contain" }}
                      />
                      <AddButton
                        aria-label="Add to cart"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                      >
                        <Plus size={24} />
                      </AddButton>
                    </ProductImageContainer>
                  </ProductLink>
                </Link>
                <ProductInfo>
                  <Disposition>
                    <ProductCategory>{product.category || "Catégorie"}</ProductCategory>
                    {product.variants && (
                      <ColorOptions>
                        <ColorVariant>{product.variants}</ColorVariant>
                      </ColorOptions>
                    )}
                  </Disposition>
                  <Disposition1>
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>${product.price}</ProductPrice>
                  </Disposition1>
                </ProductInfo>
              </ProductCard>
            ))}
          </ProductSlider>
        )
      ) : (
        <EmptyMessage>Cliquez sur l'icône Favoris ci page details bi pour voir vos favoris.</EmptyMessage>
      )}
    </SectionContainer>
  );
}