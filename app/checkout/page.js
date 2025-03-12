"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FiArrowLeft, FiArrowRight, FiCheckCircle } from "react-icons/fi"

export default function Checkout() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState([])
  const [activeTab, setActiveTab] = useState("INFORMATION")
  const [orderComplete, setOrderComplete] = useState(false)
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    country: "",
    state: "",
    address: "",
    city: "",
    postalCode: "",
  })
  const [shippingMethod, setShippingMethod] = useState("")
  const [shippingCost, setShippingCost] = useState(10)

  useEffect(() => {
    // Check if user is logged in
    const user = sessionStorage.getItem("user")
    const token = sessionStorage.getItem("token")

    if (!user || !token) {
      router.push("/login?callbackUrl=/checkout")
      return
    }

    // Load cart items from local storage
    try {
      const cartData = localStorage.getItem("cartItems")
      if (cartData) {
        const parsedCart = JSON.parse(cartData)
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          setCartItems(parsedCart)
        } else {
          // Redirect to cart if no items
          router.push("/chariot")
        }
      } else {
        // Redirect to cart if no items
        router.push("/chariot")
      }
    } catch (error) {
      console.error("Error loading cart data:", error)
      // Create demo items if error occurs (for development only)
      setCartItems([
        {
          id: "1",
          name: "Basic Heavy T-Shirt",
          color: "Black",
          size: "L",
          price: 99,
          quantity: 1,
          image: "/images/image1.png",
        },
        {
          id: "2",
          name: "Basic Fit T-Shirt",
          color: "Black",
          size: "L",
          price: 99,
          quantity: 1,
          image: "/images/image1.png",
        },
      ])
    }
  }, [router])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setContactInfo({
      ...contactInfo,
      [name]: value,
    })
  }

  const handleContinueToShipping = () => {
    if (!validateContactInfo()) {
      alert("Please fill in all required fields")
      return
    }
    setActiveTab("SHIPPING")
  }

  const handleContinueToPayment = () => {
    if (!shippingMethod) {
      alert("Please select a shipping method")
      return
    }
    setActiveTab("PAYMENT")
  }

  const handleBackToInformation = () => {
    setActiveTab("INFORMATION")
  }

  const handleBackToShipping = () => {
    setActiveTab("SHIPPING")
  }

  const handleCompleteOrder = () => {
    // Process order completion
    setOrderComplete(true)

    // Clear cart
    localStorage.removeItem("cartItems")

    // Redirect to confirmation page after a delay
    setTimeout(() => {
      router.push("/chariot")
    }, 3000)
  }

  const validateContactInfo = () => {
    const required = ["email", "firstName", "lastName", "address", "city", "country", "postalCode"]
    return required.every((field) => contactInfo[field].trim() !== "")
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + shippingCost
  }

  const handleSelectShipping = (method, cost) => {
    setShippingMethod(method)
    setShippingCost(cost)
  }

  if (orderComplete) {
    return (
      <Container>
        <OrderConfirmation>
          <FiCheckCircle size={64} color="#28a745" />
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase. Your order is being processed.</p>
          <p>Redirecting to confirmation page...</p>
        </OrderConfirmation>
      </Container>
    )
  }

  return (
    <Container>
      <BackButton onClick={() => router.push("/chariot")}>
        <FiArrowLeft size={20} />
      </BackButton>

      <CheckoutTitle>CHECKOUT</CheckoutTitle>

      <CheckoutTabs>
        <CheckoutTab
          active={activeTab === "INFORMATION"}
          onClick={() => setActiveTab("INFORMATION")}
          completed={activeTab === "SHIPPING" || activeTab === "PAYMENT"}
        >
          INFORMATION
        </CheckoutTab>
        <CheckoutTab
          active={activeTab === "SHIPPING"}
          onClick={() => (activeTab === "PAYMENT" ? setActiveTab("SHIPPING") : null)}
          disabled={activeTab === "INFORMATION"}
          completed={activeTab === "PAYMENT"}
        >
          SHIPPING
        </CheckoutTab>
        <CheckoutTab
          active={activeTab === "PAYMENT"}
          disabled={activeTab === "INFORMATION" || activeTab === "SHIPPING"}
        >
          PAYMENT
        </CheckoutTab>
      </CheckoutTabs>

      <CheckoutContent>
        <CheckoutForm>
          {activeTab === "INFORMATION" && (
            <>
              <FormSection>
                <FormSectionTitle>CONTACT INFO</FormSectionTitle>
                <FormInput
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={contactInfo.email}
                  onChange={handleInputChange}
                  required
                />
                <FormInput
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={contactInfo.phone}
                  onChange={handleInputChange}
                />
              </FormSection>

              <FormSection>
                <FormSectionTitle>SHIPPING ADDRESS</FormSectionTitle>
                <FormRow>
                  <FormInput
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={contactInfo.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <FormInput
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={contactInfo.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </FormRow>
                <FormSelect name="country" value={contactInfo.country} onChange={handleInputChange} required>
                  <option value="">Country</option>
                  <option value="SN">Senegal</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                </FormSelect>
                <FormInput
                  type="text"
                  name="state"
                  placeholder="State / Region"
                  value={contactInfo.state}
                  onChange={handleInputChange}
                />
                <FormInput
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={contactInfo.address}
                  onChange={handleInputChange}
                  required
                />
                <FormRow>
                  <FormInput
                    type="text"
                    name="city"
                    placeholder="City"
                    value={contactInfo.city}
                    onChange={handleInputChange}
                    required
                  />
                  <FormInput
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={contactInfo.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </FormRow>
              </FormSection>

              <ContinueButton onClick={handleContinueToShipping}>
                Continue to Shipping
                <FiArrowRight size={18} />
              </ContinueButton>
            </>
          )}

          {activeTab === "SHIPPING" && (
            <ShippingSection>
              <FormSection>
                <FormSectionTitle>SHIPPING METHOD</FormSectionTitle>
                <ShippingOptions>
                  <ShippingOption
                    selected={shippingMethod === "standard"}
                    onClick={() => handleSelectShipping("standard", 10)}
                  >
                    <ShippingOptionDetails>
                      <ShippingOptionName>Standard Shipping</ShippingOptionName>
                      <ShippingOptionDescription>3-5 business days</ShippingOptionDescription>
                    </ShippingOptionDetails>
                    <ShippingOptionPrice>$10.00</ShippingOptionPrice>
                  </ShippingOption>

                  <ShippingOption
                    selected={shippingMethod === "express"}
                    onClick={() => handleSelectShipping("express", 20)}
                  >
                    <ShippingOptionDetails>
                      <ShippingOptionName>Express Shipping</ShippingOptionName>
                      <ShippingOptionDescription>1-2 business days</ShippingOptionDescription>
                    </ShippingOptionDetails>
                    <ShippingOptionPrice>$20.00</ShippingOptionPrice>
                  </ShippingOption>
                </ShippingOptions>
              </FormSection>

              <ButtonGroup>
                <BackButton onClick={handleBackToInformation}>
                  <FiArrowLeft size={18} /> Back
                </BackButton>
                <ContinueButton onClick={handleContinueToPayment}>
                  Continue to Payment
                  <FiArrowRight size={18} />
                </ContinueButton>
              </ButtonGroup>
            </ShippingSection>
          )}

          {activeTab === "PAYMENT" && (
            <PaymentSection>
              <FormSection>
                <FormSectionTitle>PAYMENT METHOD</FormSectionTitle>
                <PaymentOptions>
                  <PaymentOption selected={true}>
                    <PaymentOptionDetails>
                      <PaymentOptionName>Credit Card</PaymentOptionName>
                    </PaymentOptionDetails>
                  </PaymentOption>
                </PaymentOptions>

                <FormInput type="text" placeholder="Card Number" required />

                <FormRow>
                  <FormInput type="text" placeholder="MM/YY" required />
                  <FormInput type="text" placeholder="CVC" required />
                </FormRow>

                <FormInput type="text" placeholder="Name on Card" required />
              </FormSection>

              <ButtonGroup>
                <BackButton onClick={handleBackToShipping}>
                  <FiArrowLeft size={18} /> Back
                </BackButton>
                <ContinueButton onClick={handleCompleteOrder}>
                  Complete Order
                  <FiArrowRight size={18} />
                </ContinueButton>
              </ButtonGroup>
            </PaymentSection>
          )}
        </CheckoutForm>

        <OrderSummary>
          <OrderSummaryTitle>YOUR ORDER</OrderSummaryTitle>
          <OrderItems>
            {cartItems.map((item, index) => (
              <OrderItem key={index}>
                <OrderItemImage>
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={60}
                    height={60}
                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                  />
                </OrderItemImage>
                <OrderItemDetails>
                  <OrderItemName>{item.name}</OrderItemName>
                  <OrderItemVariant>
                    {item.color}/{item.size}
                  </OrderItemVariant>
                </OrderItemDetails>
                <OrderItemQuantity>({item.quantity})</OrderItemQuantity>
                <OrderItemPrice>${item.price}</OrderItemPrice>
              </OrderItem>
            ))}
          </OrderItems>

          <OrderSummaryDivider />

          <OrderTotals>
            <OrderTotal>
              <OrderTotalLabel>Subtotal</OrderTotalLabel>
              <OrderTotalValue>${calculateSubtotal().toFixed(2)}</OrderTotalValue>
            </OrderTotal>
            <OrderTotal>
              <OrderTotalLabel>Shipping</OrderTotalLabel>
              <OrderTotalValue>
                {shippingMethod ? `$${shippingCost.toFixed(2)}` : "Calculated at next step"}
              </OrderTotalValue>
            </OrderTotal>
          </OrderTotals>

          <OrderSummaryDivider />

          <OrderTotal>
            <OrderTotalLabel>Total</OrderTotalLabel>
            <OrderTotalValue>${calculateTotal().toFixed(2)}</OrderTotalValue>
          </OrderTotal>
        </OrderSummary>
      </CheckoutContent>
    </Container>
  )
}

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
`

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 0;
`

const CheckoutTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 30px;
`

const CheckoutTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 30px;
`

const CheckoutTab = styled.button`
  padding: 15px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid ${(props) => {
    if (props.active) return "#000"
    if (props.completed) return "#28a745"
    return "transparent"
  }};
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  font-size: 14px;
  font-weight: ${(props) => (props.active || props.completed ? "500" : "400")};
  color: ${(props) => {
    if (props.active) return "#000"
    if (props.completed) return "#28a745"
    if (props.disabled) return "#aaa"
    return "#666"
  }};
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  
  &:hover {
    color: ${(props) => (props.disabled ? null : "#000")};
  }
`

const CheckoutContent = styled.div`
  display: flex;
  gap: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const CheckoutForm = styled.div`
  flex: 3;
`

const FormSection = styled.div`
  margin-bottom: 30px;
`

const FormSectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 15px;
`

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
`

const FormSelect = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #999;
  }
`

const FormRow = styled.div`
  display: flex;
  gap: 15px;
  
  ${FormInput} {
    flex: 1;
  }
`

const ContinueButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  background-color: #000;
  border: none;
  font-size: 14px;
  color: white;
  cursor: pointer;
  
  &:hover {
    background-color: #333;
  }
`

const ShippingSection = styled.div``

const ShippingOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
`

const ShippingOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid ${(props) => (props.selected ? "#000" : "#ddd")};
  background-color: ${(props) => (props.selected ? "#f5f5f5" : "white")};
  cursor: pointer;
  
  &:hover {
    border-color: #999;
  }
`

const ShippingOptionDetails = styled.div``

const ShippingOptionName = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
`

const ShippingOptionDescription = styled.div`
  font-size: 12px;
  color: #666;
`

const ShippingOptionPrice = styled.div`
  font-size: 14px;
  font-weight: 500;
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`

const PaymentSection = styled.div``

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
`

const PaymentOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid ${(props) => (props.selected ? "#000" : "#ddd")};
  background-color: ${(props) => (props.selected ? "#f5f5f5" : "white")};
  cursor: pointer;
  
  &:hover {
    border-color: #999;
  }
`

const PaymentOptionDetails = styled.div``

const PaymentOptionName = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
`

const OrderSummary = styled.div`
  flex: 2;
  background-color: #f9f9f9;
  padding: 20px;
`

const OrderSummaryTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
`

const OrderItems = styled.div`
  margin-bottom: 20px;
`

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`

const OrderItemImage = styled.div`
  width: 60px;
  height: 60px;
  margin-right: 15px;
  flex-shrink: 0;
`

const OrderItemDetails = styled.div`
  flex-grow: 1;
`

const OrderItemName = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
`

const OrderItemVariant = styled.div`
  font-size: 12px;
  color: #666;
`

const OrderItemQuantity = styled.div`
  font-size: 14px;
  margin-right: 10px;
`

const OrderItemPrice = styled.div`
  font-size: 14px;
  margin-right: 10px;
`

const OrderSummaryDivider = styled.hr`
  border: none;
  border-top: 1px solid #eaeaea;
  margin: 15px 0;
`

const OrderTotals = styled.div`
  margin-bottom: 15px;
`

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  
  &:last-child {
    font-weight: 500;
    font-size: 16px;
  }
`

const OrderTotalLabel = styled.div`
  font-size: 14px;
`

const OrderTotalValue = styled.div`
  font-size: 14px;
`

const OrderConfirmation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 50vh;
  
  h2 {
    margin: 20px 0;
    font-size: 24px;
  }
  
  p {
    margin: 5px 0;
    font-size: 16px;
    color: #666;
  }
`

