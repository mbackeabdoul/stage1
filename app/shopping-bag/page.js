"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { FiX, FiCheckCircle } from 'react-icons/fi';

export default function ShoppingBag() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping] = useState(10);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
    calculateSubtotal(storedCartItems);

    // Charger les détails de la dernière commande
    const storedLastOrder = JSON.parse(localStorage.getItem('lastOrder'));
    setLastOrder(storedLastOrder);
  }, []);

  const calculateSubtotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(total);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity;
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    calculateSubtotal(updatedCart);
  };

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    calculateSubtotal(updatedCart);
  };

  const handleContinue = () => {
    if (!agreedToTerms) {
      alert('Veuillez accepter les termes et conditions');
      return;
    }
    if (cartItems.length === 0) {
      alert('Votre panier est vide');
      return;
    }
    router.push('/checkout');
  };

  const handleFinalValidation = async () => {
    if (!agreedToTerms) {
      alert('Veuillez accepter les termes et conditions');
      return;
    }
    if (cartItems.length === 0) {
      alert('Votre panier est vide');
      return;
    }
  
    setIsLoading(true);
    console.log('Validation finale de la commande...');
  
    await new Promise((resolve) => setTimeout(resolve, 2000));
  
    const updatedOrder = {
      ...lastOrder,
      cartItems,
      total: calculateSubtotal(cartItems) + shipping,
      status: 'completed',
    };
  
    // Récupérer l'historique existant ou initialiser un tableau vide
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(updatedOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
  
    // Vider le panier
    setCartItems([]);
    localStorage.removeItem('cartItems');
  
    setOrderComplete(true);
    setIsLoading(false);
  
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  if (isLoading) {
    return (
      <Container>
        <LoaderContainer>
          <Loader />
          <LoadingText>Validation de votre commande...</LoadingText>
        </LoaderContainer>
      </Container>
    );
  }

  if (orderComplete) {
    return (
      <Container>
        <OrderConfirmation>
          <FiCheckCircle size={64} color="#28a745" />
          <h2>Commande confirmée avec succès!</h2>
          <p>Numéro de commande : {lastOrder?.orderNumber}</p>
          <p>Redirection vers l'accueil...</p>
        </OrderConfirmation>
      </Container>
    );
  }

  return (
    <Container>
      <CartItemsSection>
        {cartItems.length === 0 ? (
          <p>Votre panier est vide</p>
        ) : (
          cartItems.map((item, index) => (
            <CartItemCard key={`${item.id}-${index}`}>
              <RemoveButton onClick={() => removeItem(index)}>
                <FiX size={18} />
              </RemoveButton>
              <ItemImage src={item.image || '/placeholder.svg'} alt={item.name} />
              <ItemInfo>
                <ItemName>{item.name} (ID: {item.id})</ItemName>
                <ItemDetails>
                  {item.size && `Taille: ${item.size}, `}
                  {item.color && `Couleur: ${item.color}`}
                </ItemDetails>
                <ItemPrice>${item.price}</ItemPrice>
                <QuantityControls>
                  <QuantityButton onClick={() => updateQuantity(index, item.quantity - 1)}>-</QuantityButton>
                  <QuantityDisplay>{item.quantity}</QuantityDisplay>
                  <QuantityButton onClick={() => updateQuantity(index, item.quantity + 1)}>+</QuantityButton>
                </QuantityControls>
              </ItemInfo>
            </CartItemCard>
          ))
        )}
      </CartItemsSection>
      <OrderSummarySection>
        <SummaryCard>
          <SummaryTitle>RÉSUMÉ DE LA COMMANDE</SummaryTitle>
          <SummaryRow>
            <SummaryLabel>Sous-total</SummaryLabel>
            <SummaryValue>${subtotal}</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>Livraison</SummaryLabel>
            <SummaryValue>${shipping}</SummaryValue>
          </SummaryRow>
          <TotalRow>
            <TotalLabel>TOTAL</TotalLabel>
            <TotalValue>${subtotal + shipping}</TotalValue>
          </TotalRow>
          <TermsCheckbox>
            <CheckboxInput
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={() => setAgreedToTerms(!agreedToTerms)}
            />
            <label htmlFor="terms">J’accepte les termes et conditions</label>
          </TermsCheckbox>
          {lastOrder?.status === 'pending' ? (
            <ContinueButton onClick={handleFinalValidation}>VALIDER LA COMMANDE</ContinueButton>
          ) : (
            <ContinueButton onClick={handleContinue}>PASSER À LA CAISSE</ContinueButton>
          )}
        </SummaryCard>
      </OrderSummarySection>
    </Container>
  );
}

const Container = styled.div`display: flex; gap: 20px; padding: 20px; max-width: 1200px; margin: 0 auto;`;
const CartItemsSection = styled.div`flex: 2;`;
const CartItemCard = styled.div`display: flex; border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; position: relative;`;
const RemoveButton = styled.button`position: absolute; top: 5px; right: 5px; border: none; background: none; cursor: pointer;`;
const ItemImage = styled.img`width: 100px; height: 100px; object-fit: cover; margin-right: 15px;`;
const ItemInfo = styled.div`flex: 1;`;
const ItemName = styled.div`font-weight: bold; font-size: 16px;`;
const ItemDetails = styled.div`font-size: 14px; color: #666; margin: 5px 0;`;
const ItemPrice = styled.div`font-size: 16px; margin: 5px 0;`;
const QuantityControls = styled.div`display: flex; gap: 5px;`;
const QuantityButton = styled.button`width: 25px; height: 25px; border: 1px solid #ddd; cursor: pointer;`;
const QuantityDisplay = styled.div`width: 25px; text-align: center; line-height: 25px;`;
const OrderSummarySection = styled.div`flex: 1;`;
const SummaryCard = styled.div`border: 1px solid #ddd; padding: 20px;`;
const SummaryTitle = styled.h2`font-size: 18px; margin-bottom: 15px;`;
const SummaryRow = styled.div`display: flex; justify-content: space-between; margin-bottom: 10px;`;
const SummaryLabel = styled.div`font-size: 14px;`;
const SummaryValue = styled.div`font-size: 14px;`;
const TotalRow = styled.div`display: flex; justify-content: space-between; font-weight: bold; margin-top: 15px;`;
const TotalLabel = styled.div`font-size: 16px;`;
const TotalValue = styled.div`font-size: 16px;`;
const TermsCheckbox = styled.div`margin: 15px 0; font-size: 14px;`;
const CheckboxInput = styled.input`margin-right: 5px;`;
const ContinueButton = styled.button`width: 100%; padding: 15px; background: #000; color: white; border: none; cursor: pointer; font-size: 16px;`;
const OrderConfirmation = styled.div`text-align: center; padding: 50px;`;
const LoaderContainer = styled.div`display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;`;
const Loader = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
const LoadingText = styled.p`margin-top: 10px; font-size: 16px; color: #333;`;