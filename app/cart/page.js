"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

export default function Cart() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
  }, []);

  return (
    <Container>
      <PageTitle>Vos Commandes</PageTitle>
      {orders.length === 0 ? (
        <NoOrdersMessage>Aucune commande trouvée.</NoOrdersMessage>
      ) : (
        <OrdersGrid>
          {orders.map((order, index) => (
            <OrderCard key={index}>
              <OrderHeader>
                <OrderNumber>Commande #{order.orderNumber}</OrderNumber>
                <OrderStatus className={order.status === 'completed' ? 'completed' : 'pending'}>
                  {order.status === 'completed' ? 'Complétée' : 'En attente'}
                </OrderStatus>
              </OrderHeader>
              <OrderDetails>
                {order.cartItems.map((item) => (
                  <OrderItem key={item.id}>
                    <ItemName>{item.name} (ID: {item.id})</ItemName>
                    <ItemDetails>
                      Quantité: {item.quantity}, Prix: ${item.price} x {item.quantity} = $
                      {item.price * item.quantity}
                    </ItemDetails>
                  </OrderItem>
                ))}
              </OrderDetails>
              <OrderTotal>
                <TotalLabel>Sous-total :</TotalLabel>
                <TotalValue>${order.subtotal}</TotalValue>
              </OrderTotal>
              <OrderTotal>
                <TotalLabel>Livraison :</TotalLabel>
                <TotalValue>${order.shipping}</TotalValue>
              </OrderTotal>
              <OrderTotal>
                <TotalLabel>Total :</TotalLabel>
                <TotalValue>${order.total}</TotalValue>
              </OrderTotal>
              <Divider />
              <OrderInfo>
                <InfoLabel>Adresse :</InfoLabel>
                <InfoValue>
                  {order.contactInfo.address}, {order.contactInfo.city}, {order.contactInfo.postalCode}, {order.contactInfo.country}
                </InfoValue>
              </OrderInfo>
              <OrderInfo>
                <InfoLabel>Email :</InfoLabel>
                <InfoValue>{order.contactInfo.email}</InfoValue>
              </OrderInfo>
              <OrderInfo>
                <InfoLabel>Téléphone :</InfoLabel>
                <InfoValue>{order.contactInfo.phone}</InfoValue>
              </OrderInfo>
            </OrderCard>
          ))}
        </OrdersGrid>
      )}
    </Container>
  );
}

const Container = styled.div`
  max-width: 1400px;
  margin: 40px auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 40px;
`;

const NoOrdersMessage = styled.p`
  font-size: 18px;
  color: #666;
  text-align: center;
  padding: 20px;
`;

const OrdersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 colonnes par défaut */
  gap: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr); /* 2 colonnes sur tablettes */
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* 1 colonne sur mobile */
  }
`;

const OrderCard = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const OrderNumber = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #222;
`;

const OrderStatus = styled.span`
  font-size: 14px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 12px;

  &.completed {
    background: #e6f4ea;
    color: #2e7d32;
  }

  &.pending {
    background: #fff3e0;
    color: #f57c00;
  }
`;

const OrderDetails = styled.div`
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ItemName = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
`;

const ItemDetails = styled.div`
  font-size: 14px;
  color: #666;
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const TotalLabel = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #333;
`;

const TotalValue = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #333;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #f0f0f0;
  margin: 15px 0;
`;

const OrderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const InfoLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #555;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: #777;
  text-align: right;
`;