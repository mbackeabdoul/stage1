"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Ajout de useSearchParams
import styled from "styled-components";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Pour récupérer les paramètres d'URL
  const [cartItems, setCartItems] = useState([]);
  const [activeTab, setActiveTab] = useState("INFORMATION");
  const [orderComplete, setOrderComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    country: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [shippingMethod, setShippingMethod] = useState("");
  const [shippingCost, setShippingCost] = useState(10);
  const [paymentMethod, setPaymentMethod] = useState("payDunya");
  const [mobilePaymentOption, setMobilePaymentOption] = useState("");
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    const loadCartItemById = () => {
      try {
        // Récupérer l'ID du produit depuis les paramètres d'URL
        const productId = searchParams.get("productId");
        console.log("ID du produit cliqué récupéré depuis l'URL :", productId);

        if (!productId) {
          console.log("Aucun productId trouvé dans l'URL, redirection vers /shopping-bag");
          router.push("/shopping-bag");
          return;
        }

        // Vérifier si cartItems existe dans localStorage
        const storedCart = localStorage.getItem("cartItems");
        let existingCart = storedCart ? JSON.parse(storedCart) : [];

        // Si le panier est vide ou n'est pas un tableau, initialiser avec le nouvel élément
        if (!Array.isArray(existingCart)) {
          existingCart = [];
        }

        // Vérifier si l'élément avec cet ID existe déjà dans le panier
        const itemExists = existingCart.find((item) => item.id === productId);
        if (!itemExists) {
          // Simuler l'ajout d'un produit avec cet ID (vous devriez normalement récupérer les détails via une API)
          const newItem = { id: productId, name: `Produit ${productId}`, price: 50, quantity: 1, image: "/placeholder.jpg" }; // Exemple
          existingCart.push(newItem);
          localStorage.setItem("cartItems", JSON.stringify(existingCart));
          console.log("Nouvel élément ajouté au panier :", newItem);
        }

        // Ne garder que l'élément avec l'ID cliqué pour cet affichage
        const selectedItem = existingCart.find((item) => item.id === productId);
        if (!selectedItem) {
          console.log("Produit non trouvé dans le panier, redirection vers /shopping-bag");
          router.push("/shopping-bag");
          return;
        }

        setCartItems([selectedItem]); // On ne garde que cet élément dans cartItems
        console.log("Élément sélectionné pour le checkout :", selectedItem);
      } catch (error) {
        console.error("Erreur lors du chargement de l'élément du panier :", error);
        setPaymentError("Erreur lors de la récupération de votre produit");
        router.push("/shopping-bag");
      }
    };

    loadCartItemById();
  }, [router, searchParams]);

  useEffect(() => {
    if (cartItems.length > 0) {
      // Mettre à jour uniquement l'élément actuel dans localStorage si nécessaire
      const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      const updatedCart = storedCart.map((item) =>
        item.id === cartItems[0].id ? cartItems[0] : item
      );
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      console.log("CartItems mis à jour dans localStorage :", updatedCart);
    }
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("contactInfo", JSON.stringify(contactInfo));
    console.log("ContactInfo sauvegardé dans localStorage :", contactInfo);
  }, [contactInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateContactInfo = () =>
    ["email", "firstName", "lastName", "address", "city", "country", "postalCode"].every(
      (field) => contactInfo[field].trim() !== ""
    );

  const handleContinueToShipping = () => {
    if (!validateContactInfo()) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setActiveTab("SHIPPING");
  };

  const handleContinueToPayment = () => {
    if (!shippingMethod) {
      alert("Veuillez sélectionner une méthode de livraison");
      return;
    }
    setActiveTab("PAYMENT");
  };

  const handleConfirmOrder = async () => {
    try {
      if (!mobilePaymentOption) {
        setPaymentError("Veuillez sélectionner une option de paiement mobile (ex. Orange Money ou Wave)");
        return;
      }
      if (!contactInfo.phone || contactInfo.phone.trim() === "") {
        setPaymentError("Veuillez entrer un numéro de téléphone valide");
        return;
      }
      if (!cartItems || cartItems.length === 0) {
        setPaymentError("Votre panier est vide");
        return;
      }

      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const simulatedResponse = { success: true, redirect_url: "https://paydunya.com/checkout/success", token: "simulated-token-123" };

      if (simulatedResponse.success) {
        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        localStorage.setItem(
          "lastOrder",
          JSON.stringify({
            orderNumber,
            cartItems,
            contactInfo,
            shippingMethod,
            shippingCost,
            paymentMethod,
            total: calculateTotal(),
            status: "pending",
            token: simulatedResponse.token,
          })
        );

        setOrderComplete(true);
        setIsLoading(false);
        setTimeout(() => router.push("/shopping-bag"), 2000);
      } else {
        throw new Error("Échec simulé du paiement");
      }
    } catch (error) {
      setPaymentError(error.message || "Une erreur est survenue lors du traitement du paiement");
      setIsLoading(false);
    }
  };

  const calculateSubtotal = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const calculateTotal = () => calculateSubtotal() + shippingCost;

  if (isLoading) {
    return (
      <Container>
        <LoaderContainer>
          <Loader />
          <LoadingText>Traitement de votre paiement...</LoadingText>
        </LoaderContainer>
      </Container>
    );
  }

  if (orderComplete) {
    return (
      <Container>
        <OrderConfirmation>
          <FiCheckCircle size={64} color="#28a745" />
          <h2>Paiement effectué avec succès!</h2>
          <p>Redirection vers votre panier pour ajuster les quantités...</p>
        </OrderConfirmation>
      </Container>
    );
  }

  return (
    <Container>
      <CheckoutTabs>
        <CheckoutTab active={activeTab === "INFORMATION"}>INFORMATION</CheckoutTab>
        <CheckoutTab active={activeTab === "SHIPPING"}>LIVRAISON</CheckoutTab>
        <CheckoutTab active={activeTab === "PAYMENT"}>PAIEMENT</CheckoutTab>
      </CheckoutTabs>

      <CheckoutContent>
        {activeTab === "INFORMATION" && (
          <CheckoutForm>
            <FormSection>
              <FormInput
                name="email"
                placeholder="Email"
                value={contactInfo.email}
                onChange={handleInputChange}
                required
              />
              <FormInput
                name="phone"
                placeholder="Téléphone"
                value={contactInfo.phone}
                onChange={handleInputChange}
                required
              />
              <FormInput
                name="firstName"
                placeholder="Prénom"
                value={contactInfo.firstName}
                onChange={handleInputChange}
                required
              />
              <FormInput
                name="lastName"
                placeholder="Nom"
                value={contactInfo.lastName}
                onChange={handleInputChange}
                required
              />
              <FormInput
                name="address"
                placeholder="Adresse"
                value={contactInfo.address}
                onChange={handleInputChange}
                required
              />
              <FormInput
                name="city"
                placeholder="Ville"
                value={contactInfo.city}
                onChange={handleInputChange}
                required
              />
              <FormInput
                name="postalCode"
                placeholder="Code postal"
                value={contactInfo.postalCode}
                onChange={handleInputChange}
                required
              />
              <FormSelect name="country" value={contactInfo.country} onChange={handleInputChange} required>
                <option value="">Pays</option>
                <option value="SN">Sénégal</option>
              </FormSelect>
            </FormSection>
            <ContinueButton onClick={handleContinueToShipping}>
              Continuer vers la livraison <FiArrowRight />
            </ContinueButton>
          </CheckoutForm>
        )}

        {activeTab === "SHIPPING" && (
          <CheckoutForm>
            <FormSection>
              <ShippingOption
                selected={shippingMethod === "standard"}
                onClick={() => {
                  setShippingMethod("standard");
                  setShippingCost(10);
                }}
              >
                Livraison standard - $10
              </ShippingOption>
              <ShippingOption
                selected={shippingMethod === "express"}
                onClick={() => {
                  setShippingMethod("express");
                  setShippingCost(20);
                }}
              >
                Livraison express - $20
              </ShippingOption>
            </FormSection>
            <ButtonGroup>
              <BackButton onClick={() => setActiveTab("INFORMATION")}>Retour</BackButton>
              <ContinueButton onClick={handleContinueToPayment}>
                Continuer vers le paiement <FiArrowRight />
              </ContinueButton>
            </ButtonGroup>
          </CheckoutForm>
        )}

        {activeTab === "PAYMENT" && (
          <CheckoutForm>
            <FormSection>
              <PaymentOption>
                <input
                  type="radio"
                  id="payDunya"
                  checked={paymentMethod === "payDunya"}
                  onChange={() => setPaymentMethod("payDunya")}
                />
                <label htmlFor="payDunya">Paiement mobile (PayDunya)</label>
              </PaymentOption>
              {paymentMethod === "payDunya" && (
                <MobilePaymentOptions>
                  <MobilePaymentOption
                    selected={mobilePaymentOption === "orangeMoney"}
                    onClick={() => setMobilePaymentOption("orangeMoney")}
                  >
                    Orange Money
                  </MobilePaymentOption>
                  <MobilePaymentOption
                    selected={mobilePaymentOption === "wave"}
                    onClick={() => setMobilePaymentOption("wave")}
                  >
                    Wave
                  </MobilePaymentOption>
                  {paymentError && <ErrorMessage>{paymentError}</ErrorMessage>}
                  <MobilePaymentInstructions>
                    Simulation : Vous serez redirigé après la confirmation.
                  </MobilePaymentInstructions>
                </MobilePaymentOptions>
              )}
            </FormSection>
            <ButtonGroup>
              <BackButton onClick={() => setActiveTab("SHIPPING")}>Retour</BackButton>
              <ContinueButton onClick={handleConfirmOrder}>
                Confirmer <FiArrowRight />
              </ContinueButton>
            </ButtonGroup>
          </CheckoutForm>
        )}

        <OrderSummary>
          <OrderSummaryTitle>VOTRE COMMANDE</OrderSummaryTitle>
          {cartItems.map((item) => (
            <OrderItem key={item.id}>
              <ItemImage src={item.image || "/placeholder.jpg"} alt={item.name} />
              <OrderItemDetails>
                <OrderItemName>{item.name}</OrderItemName>
                <OrderItemSubtext>ID: {item.id}</OrderItemSubtext>
                <OrderItemPrice>${item.price} x {item.quantity}</OrderItemPrice>
              </OrderItemDetails>
            </OrderItem>
          ))}
          <OrderTotal>
            <OrderTotalLabel>Total</OrderTotalLabel>
            <OrderTotalValue>${calculateTotal()}</OrderTotalValue>
          </OrderTotal>
        </OrderSummary>
      </CheckoutContent>
    </Container>
  );
}

// Styled Components (inchangés sauf si nécessaire pour la cohérence)
const Container = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const CheckoutTabs = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const CheckoutTab = styled.div`
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  font-size: 1rem;
  color: ${(props) => (props.active ? "#3a3af4" : "#666")};
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #3a3af4;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const CheckoutContent = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const CheckoutForm = styled.div`
  flex: 2;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FormSection = styled.div`
  margin-bottom: 20px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #3a3af4;
    outline: none;
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.875rem;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.875rem;
  }
`;

const ContinueButton = styled.button`
  padding: 12px 20px;
  background: #3a3af4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background: #1a1af4;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
    font-size: 0.875rem;
  }
`;

const BackButton = styled.button`
  padding: 12px 20px;
  border: 1px solid #ddd;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1rem;

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.875rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ShippingOption = styled.div`
  padding: 12px;
  border: 1px solid ${(props) => (props.selected ? "#3a3af4" : "#ddd")};
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 4px;
  background-color: ${(props) => (props.selected ? "#f5f5ff" : "transparent")};
  transition: all 0.3s ease;

  &:hover {
    border-color: #3a3af4;
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.875rem;
  }
`;

const PaymentOption = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MobilePaymentOptions = styled.div`
  margin-left: 20px;
`;

const MobilePaymentOption = styled.div`
  padding: 12px;
  border: 1px solid ${(props) => (props.selected ? "#3a3af4" : "#ddd")};
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 4px;
  background-color: ${(props) => (props.selected ? "#f5f5ff" : "transparent")};
  transition: all 0.3s ease;

  &:hover {
    border-color: #3a3af4;
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.875rem;
  }
`;

const MobilePaymentInstructions = styled.p`
  font-size: 12px;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: red;
  margin: 10px 0;
  font-size: 0.875rem;
`;

const OrderSummary = styled.div`
  flex: 1;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const OrderSummaryTitle = styled.h2`
  font-size: 1.125rem;
  margin-bottom: 15px;
  color: #1a1a1a;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  background: #fafafa;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 8px;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 4px;

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

const OrderItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const OrderItemName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const OrderItemSubtext = styled.div`
  font-size: 0.875rem;
  color: #666;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const OrderItemPrice = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #3a3af4;

  @media (max-width: 768px) {
    font-size: 0.875rem;
    margin-top: 4px;
  }
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #ddd;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const OrderTotalLabel = styled.div`
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const OrderTotalValue = styled.div`
  font-size: 1rem;
  color: #3a3af4;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const OrderConfirmation = styled.div`
  text-align: center;
  padding: 50px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Loader = styled.div`
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
  margin-top: 10px;
  font-size: 16px;
  color: #333;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;