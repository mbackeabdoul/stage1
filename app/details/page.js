"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FiHeart } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function ProductDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("token");

    if (!user || !token) {
      router.push(`/login?callbackUrl=/details?id=${id}`);
      return;
    }

    if (!id) {
      setError("Produit non trouvé");
      setIsLoading(false);
      return;
    }

    const fetchProductData = async () => {
      try {
        const response = await fetch(`https://projets1-back-3.onrender.com/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 401) {
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
            router.push(`/login?callbackUrl=/details?id=${id}`);
            return;
          }
          throw new Error("Failed to fetch product details");
        }

        const data = await response.json();
        setProductData(data);
        if (data.color) setSelectedColor(data.color);
        if (data.size) setSelectedSize(data.size);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    const checkIfFavorite = async () => {
      try {
        const user = sessionStorage.getItem("user");
        const token = sessionStorage.getItem("token");
        if (!user || !token) return;
        const userId = JSON.parse(user)._id;
        const response = await fetch(
          `https://projets1-back-3.onrender.com/api/favorites/check?productId=${id}&userId=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.isFavorite);
        }
      } catch (error) {
        console.error("Error checking if favorite:", error);
      }
    };

    fetchProductData();
    checkIfFavorite();
  }, [router, id]);

  const handleToggleFavorite = async () => {
    if (isAddingToFavorites) return;

    try {
      setIsAddingToFavorites(true);
      const token = sessionStorage.getItem("token");
      const user = sessionStorage.getItem("user");
      if (!token || !user) {
        toast.error("Vous devez être connecté pour gérer les favoris");
        router.push("/login");
        return;
      }

      const method = isFavorite ? "DELETE" : "POST";
      const url = isFavorite
        ? `https://projets1-back-3.onrender.com/api/favorites/remove/${id}`
        : "https://projets1-back-3.onrender.com/api/favorites/add";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: method === "POST" ? JSON.stringify({ productId: id }) : null,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Échec de la mise à jour des favoris");
      }

      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? "Produit retiré des favoris" : "Produit ajouté aux favoris");
    } catch (err) {
      console.error("Erreur lors de la gestion des favoris:", err);
      toast.error(err.message || "Impossible de mettre à jour les favoris");
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  const handleColorSelect = (color) => setSelectedColor(color);
  const handleSizeSelect = (size) => setSelectedSize(size);
  const handleThumbnailClick = (index) => setSelectedImage(index);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Veuillez sélectionner une taille");
      return;
    }
    if (!selectedColor) {
      toast.error("Veuillez sélectionner une couleur");
      return;
    }

    const cartItem = {
      id: productData._id || id,
      name: productData.name,
      price: productData.price,
      image: productData.image || "/placeholder.svg",
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
    };

    let cartItems = [];
    try {
      const existingCart = localStorage.getItem("cartItems");
      if (existingCart) {
        cartItems = JSON.parse(existingCart);
        const existingItemIndex = cartItems.findIndex(
          (item) => item.id === cartItem.id && item.color === cartItem.color && item.size === cartItem.size
        );
        if (existingItemIndex >= 0) {
          cartItems[existingItemIndex].quantity += quantity;
        } else {
          cartItems.push(cartItem);
        }
      } else {
        cartItems = [cartItem];
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      toast.success("Produit ajouté au panier");

      // Rediriger vers checkout avec uniquement l'ID du produit cliqué
      router.push(`/checkout?productId=${cartItem.id}`);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      toast.error("Erreur lors de l'ajout au panier");
    }
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Chargement...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error || !productData) {
    return (
      <LoadingContainer>
        <LoadingText>{error || "Produit non trouvé"}</LoadingText>
        <BackButton onClick={() => router.push("/")}>Retour aux produits</BackButton>
      </LoadingContainer>
    );
  }

  const productImages = [productData.image || "/placeholder.svg?height=600&width=500"];
  const availableColors = ["Rouge", "Noir", "Blanc", "Bleu", "Vert", "Jaune"];
  const availableSizes = ["XS", "S", "M", "L", "XL", "2X"];

  return (
    <Container>
      <ProductDetailContent>
        <MainImage>
          <Image
            src={productImages[selectedImage] || "/placeholder.svg"}
            alt={productData.name}
            width={500}
            height={600}
            quality={100}
            priority
          />
        </MainImage>

        <ThumbnailColumn>
          {productImages.map((image, index) => (
            <Thumbnail key={index} isSelected={selectedImage === index} onClick={() => handleThumbnailClick(index)}>
              <Image src={image} alt={`Thumbnail ${index + 1}`} width={80} height={80} quality={80} />
            </Thumbnail>
          ))}
        </ThumbnailColumn>

        <ProductInfo>
          <WishlistButton onClick={handleToggleFavorite} isFavorite={isFavorite} disabled={isAddingToFavorites}>
            <FiHeart size={20} fill={isFavorite ? "#e53935" : "none"} color={isFavorite ? "#e53935" : "currentColor"} />
          </WishlistButton>
          <ProductTitle>{productData.name}</ProductTitle>
          <ProductPrice>${productData.price}</ProductPrice>
          <TaxInfo>MRP incl. of all taxes</TaxInfo>
          <ProductDescription>{productData.description}</ProductDescription>

          <ColorSection>
            <SectionLabel>Couleur: {selectedColor}</SectionLabel>
            <ColorOptions>
              {availableColors.map((color) => (
                <ColorOption
                  key={color}
                  color={color.toLowerCase()}
                  selected={selectedColor === color}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </ColorOptions>
          </ColorSection>

          <SizeSection>
            <SectionLabel>Taille: {selectedSize}</SectionLabel>
            <SizeOptions>
              {availableSizes.map((size) => (
                <SizeButton key={size} selected={selectedSize === size} onClick={() => handleSizeSelect(size)}>
                  {size}
                </SizeButton>
              ))}
            </SizeOptions>
            <SizeGuideLink>TROUVER VOTRE TAILLE | GUIDE DE MESURE</SizeGuideLink>
          </SizeSection>

          <CategoryInfo>
            <SectionLabel>Catégorie:</SectionLabel>
            <CategoryValue>{productData.category}</CategoryValue>
          </CategoryInfo>

          <GenreInfo>
            <SectionLabel>Genre:</SectionLabel>
            <GenreValue>{productData.genre}</GenreValue>
          </GenreInfo>

          <AddToCartButton onClick={handleAddToCart}>AJOUTER AU PANIER</AddToCartButton>
        </ProductInfo>
      </ProductDetailContent>
    </Container>
  );
}

// Styled Components (inchangés)
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #000;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  padding: 10px 20px;
  background-color: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #333;
  }
`;

const Container = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  font-family: "Inter", sans-serif;
`;

const ProductDetailContent = styled.div`
  display: flex;
  padding: 20px;
  gap: 20px;
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const MainImage = styled.div`
  flex: 1;
  max-width: 50%;
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
  @media (max-width: 1024px) {
    max-width: 100%;
    margin-bottom: 20px;
  }
`;

const ThumbnailColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 500px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 4px;
  }
  @media (max-width: 1024px) {
    flex-direction: row;
    max-height: none;
    overflow-x: auto;
    overflow-y: hidden;
  }
`;

const Thumbnail = styled.div`
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  cursor: pointer;
  border: 2px solid ${(props) => (props.isSelected ? "#000" : "#eaeaea")};
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &:hover {
    border-color: #999;
  }
`;

const ProductInfo = styled.div`
  flex: 1;
  position: relative;
`;

const WishlistButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.1);
  }
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const ProductTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ProductPrice = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 5px;
`;

const TaxInfo = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const ProductDescription = styled.p`
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 30px;
  color: #333;
`;

const SectionLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
`;

const ColorSection = styled.div`
  margin-bottom: 30px;
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 10px;
`;

const ColorOption = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
  border: 2px solid ${(props) => (props.selected ? "#000" : "transparent")};
  cursor: pointer;
  &:hover {
    border-color: #ccc;
  }
`;

const SizeSection = styled.div`
  margin-bottom: 30px;
`;

const SizeOptions = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const SizeButton = styled.button`
  width: 50px;
  height: 40px;
  border: 1px solid ${(props) => (props.selected ? "#000" : "#ddd")};
  background-color: ${(props) => (props.selected ? "#000" : "white")};
  color: ${(props) => (props.selected ? "white" : "#000")};
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    border-color: #000;
  }
`;

const SizeGuideLink = styled.a`
  font-size: 12px;
  text-decoration: none;
  color: #333;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const CategoryValue = styled.span`
  font-size: 16px;
  color: #333;
`;

const GenreInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
`;

const GenreValue = styled.span`
  font-size: 16px;
  color: #333;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #e5e5e5;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #d5d5d5;
  }
`;