'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { FiArrowLeft, FiCreditCard, FiCheckCircle, FiSmartphone } from 'react-icons/fi';

export default function PaymentSection({ onBackToShipping, onCompleteOrder }) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [mobileMoneyDetails, setMobileMoneyDetails] = useState({
    phoneNumber: '',
    paymentConfirmed: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value
    });
  };

  const handleMobileMoneyInputChange = (e) => {
    const { name, value } = e.target;
    setMobileMoneyDetails({
      ...mobileMoneyDetails,
      [name]: value
    });
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handleMobileMoneyProviderSelect = (provider) => {
    setMobileMoneyProvider(provider);
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      if (paymentMethod === 'paydunya') {
        // Simulate API call to Paydunya with specific mobile money provider
        // Here you would make a request to your backend with provider info
        
        // For demo, simulate a successful payment after 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setMobileMoneyDetails({
          ...mobileMoneyDetails,
          paymentConfirmed: true
        });
        
        // Call the complete order function from parent
        setTimeout(() => {
          onCompleteOrder();
        }, 1000);
      } else if (paymentMethod === 'card') {
        // Process card payment
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Call the complete order function from parent
        onCompleteOrder();
      }
    } catch (error) {
      console.error('Payment processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PaymentContainer>
      <BackButton onClick={onBackToShipping}>
        <FiArrowLeft size={18} /> Back to Shipping
      </BackButton>
      
      <PaymentTitle>SELECT PAYMENT METHOD</PaymentTitle>
      
      <PaymentMethods>
        <PaymentMethodCard 
          selected={paymentMethod === 'paydunya'} 
          onClick={() => handlePaymentMethodSelect('paydunya')}
        >
          <MethodIcon>
            <Image
              src="/images/paydunya-logo.png" 
              alt="Paydunya" 
              style={{ width: '24px', height: '24px' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='1' y='4' width='22' height='16' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='1' y1='10' x2='23' y2='10'%3E%3C/line%3E%3C/svg%3E";
              }}
            />
          </MethodIcon>
          <MethodName>Mobile Money</MethodName>
        </PaymentMethodCard>
        
        <PaymentMethodCard 
          selected={paymentMethod === 'card'} 
          onClick={() => handlePaymentMethodSelect('card')}
        >
          <MethodIcon>
            <FiCreditCard size={24} />
          </MethodIcon>
          <MethodName>Credit/Debit Card</MethodName>
        </PaymentMethodCard>
      </PaymentMethods>
      
      {paymentMethod === 'paydunya' && (
        <PaymentForm onSubmit={handleSubmitPayment}>
          {mobileMoneyDetails.paymentConfirmed ? (
            <PaymentConfirmation>
              <FiCheckCircle size={48} color="#28a745" />
              <p>Payment confirmed!</p>
            </PaymentConfirmation>
          ) : (
            <>
              <PaymentTitle>SELECT MOBILE MONEY PROVIDER</PaymentTitle>
              <MobileMoneyProviders>
                <MobileMoneyProvider
                  selected={mobileMoneyProvider === 'wave'}
                  onClick={() => handleMobileMoneyProviderSelect('wave')}
                >
                  <ProviderIcon>
                    <Image
                      src="/images/wave-logo.png" 
                      alt="Wave" 
                      style={{ width: '24px', height: '24px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%232DA9E9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 6c0 0 4-2 10-2s10 2 10 2'%3E%3C/path%3E%3Cpath d='M2 12c0 0 4-2 10-2s10 2 10 2'%3E%3C/path%3E%3Cpath d='M2 18c0 0 4-2 10-2s10 2 10 2'%3E%3C/path%3E%3C/svg%3E";
                      }}
                    />
                  </ProviderIcon>
                  <ProviderName>Wave</ProviderName>
                </MobileMoneyProvider>
                
                <MobileMoneyProvider
                  selected={mobileMoneyProvider === 'orange-money'}
                  onClick={() => handleMobileMoneyProviderSelect('orange-money')}
                >
                  <ProviderIcon>
                    <Image
                      src="/images/orange-money-logo.png" 
                      alt="Orange Money" 
                      style={{ width: '24px', height: '24px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23FF7900' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='12' y1='8' x2='12' y2='16'%3E%3C/line%3E%3Cline x1='8' y1='12' x2='16' y2='12'%3E%3C/line%3E%3C/svg%3E";
                      }}
                    />
                  </ProviderIcon>
                  <ProviderName>Orange Money</ProviderName>
                </MobileMoneyProvider>
                
                <MobileMoneyProvider
                  selected={mobileMoneyProvider === 'free-money'}
                  onClick={() => handleMobileMoneyProviderSelect('free-money')}
                >
                  <ProviderIcon>
                    <Image 
                      src="/images/free-money-logo.png" 
                      alt="Free Money" 
                      style={{ width: '24px', height: '24px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23E20D18' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='6' width='20' height='12' rx='2'%3E%3C/rect%3E%3Cpath d='M12 12a2 2 0 0 0 0-4a2 2 0 0 0 0 4z'%3E%3C/path%3E%3C/svg%3E";
                      }}
                    />
                  </ProviderIcon>
                  <ProviderName>Free Money</ProviderName>
                </MobileMoneyProvider>
              </MobileMoneyProviders>
              
              {mobileMoneyProvider && (
                <>
                  <FormInput 
                    type="tel" 
                    name="phoneNumber" 
                    placeholder="Phone Number" 
                    value={mobileMoneyDetails.phoneNumber}
                    onChange={handleMobileMoneyInputChange}
                    required
                  />
                  <PaymentInfo>
                    You will receive a payment confirmation request on your phone from {
                      mobileMoneyProvider === 'wave' ? 'Wave' :
                      mobileMoneyProvider === 'orange-money' ? 'Orange Money' :
                      mobileMoneyProvider === 'free-money' ? 'Free Money' : 'Paydunya'
                    }.
                  </PaymentInfo>
                  
                  <SubmitButton 
                    type="submit" 
                    disabled={isProcessing || !mobileMoneyDetails.phoneNumber}
                  >
                    {isProcessing ? 'Processing...' : `Pay with ${
                      mobileMoneyProvider === 'wave' ? 'Wave' :
                      mobileMoneyProvider === 'orange-money' ? 'Orange Money' :
                      mobileMoneyProvider === 'free-money' ? 'Free Money' : 'Mobile Money'
                    }`}
                  </SubmitButton>
                </>
              )}
            </>
          )}
        </PaymentForm>
      )}
      
      {paymentMethod === 'card' && (
        <PaymentForm onSubmit={handleSubmitPayment}>
          <FormInput 
            type="text" 
            name="cardNumber" 
            placeholder="Card Number" 
            value={cardDetails.cardNumber}
            onChange={handleInputChange}
            required
          />
          <FormInput 
            type="text" 
            name="cardName" 
            placeholder="Name on Card" 
            value={cardDetails.cardName}
            onChange={handleInputChange}
            required
          />
          <FormRow>
            <FormInput 
              type="text" 
              name="expiryDate" 
              placeholder="MM/YY" 
              value={cardDetails.expiryDate}
              onChange={handleInputChange}
              required
            />
            <FormInput 
              type="text" 
              name="cvv" 
              placeholder="CVV" 
              value={cardDetails.cvv}
              onChange={handleInputChange}
              required
            />
          </FormRow>
          
          <SubmitButton 
            type="submit" 
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </SubmitButton>
        </PaymentForm>
      )}
    </PaymentContainer>
  );
}

// Styled Components
const PaymentContainer = styled.div`
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 20px;
  font-size: 14px;
  color: #333;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PaymentTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const PaymentMethods = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PaymentMethodCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border: 1px solid ${props => props.selected ? '#000' : '#ddd'};
  background-color: ${props => props.selected ? '#f5f5f5' : 'white'};
  cursor: pointer;
  flex: 1;
  
  &:hover {
    border-color: #999;
  }
`;

const MethodIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MethodName = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const MobileMoneyProviders = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MobileMoneyProvider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid ${props => props.selected ? '#000' : '#ddd'};
  background-color: ${props => props.selected ? '#f5f5f5' : 'white'};
  cursor: pointer;
  flex: 1;
  min-width: 120px;
  
  &:hover {
    border-color: #999;
  }
`;

const ProviderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProviderName = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const PaymentForm = styled.form`
  margin-top: 20px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #999;
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 15px;
  
  ${FormInput} {
    flex: 1;
  }
`;

const PaymentInfo = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const SubmitButton = styled.button`
  display: block;
  width: 100%;
  padding: 15px;
  background-color: #000;
  color: white;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  opacity: ${props => props.disabled ? 0.7 : 1};
  
  &:hover {
    background-color: ${props => props.disabled ? '#000' : '#333'};
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const PaymentConfirmation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
  
  p {
    margin-top: 15px;
    font-size: 18px;
    font-weight: 500;
  }
`;