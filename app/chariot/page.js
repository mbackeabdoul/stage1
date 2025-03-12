"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FiHeart, FiX, FiRefreshCw } from "react-icons/fi"

export default function ShoppingBag() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [cartItems, setCartItems] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [shipping, setShipping] = useState(10)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [activeTab, setActiveTab] = useState("SHOPPING BAG")

  useEffect(() => {
    // Check if user is logged in
    const user = sessionStorage.getItem("user")
    const token = sessionStorage.getItem("token")

    if (!user || !token) {
      router.push("/login?callbackUrl=/chariot")
      return
    }

    // Load cart items from localStorage
    try {
      const cartData = localStorage.getItem("cartItems")
      if (cartData) {
        const parsedCart = JSON.parse(cartData)
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          setCartItems(parsedCart)
          calculateSubtotal(parsedCart)
        } else {
          // Set default items if cart is empty (for demo purposes)
          const defaultItems = [
            {
              id: "1",
              name: "Full Sleeve Zipper",
              category: "Cotton T Shirt",
              price: 99,
              color: "black",
              size: "L",
              quantity: 1,
              image: "/images/image1.png",
            },
            {
              id: "2",
              name: "Basic Slim Fit T-Shirt",
              category: "Cotton T Shirt",
              price: 99,
              color: "black",
              size: "L",
              quantity: 1,
              image: "/images/image2.png",
            },
          ]
          setCartItems(defaultItems)
          calculateSubtotal(defaultItems)
        }
      } else {
        // Set default items if cart is empty (for demo purposes)
        const defaultItems = [
          {
            id: "1",
            name: "Full Sleeve Zipper",
            category: "Cotton T Shirt",
            price: 99,
            color: "black",
            size: "L",
            quantity: 1,
            image: "/images/image1.png",
          },
          {
            id: "2",
            name: "Basic Slim Fit T-Shirt",
            category: "Cotton T Shirt",
            price: 99,
            color: "black",
            size: "L",
            quantity: 1,
            image: "/images/image2.png",
          },
        ]
        setCartItems(defaultItems)
        calculateSubtotal(defaultItems)
      }
    } catch (error) {
      console.error("Error loading cart data:", error)
      // Set default items if there's an error
      const defaultItems = [
        {
          id: "1",
          name: "Full Sleeve Zipper",
          category: "Cotton T Shirt",
          price: 99,
          color: "black",
          size: "L",
          quantity: 1,
          image: "/images/image1.png",
        },
        {
          id: "2",
          name: "Basic Slim Fit T-Shirt",
          category: "Cotton T Shirt",
          price: 99,
          color: "black",
          size: "L",
          quantity: 1,
          image: "/images/image2.png",
        },
      ]
      setCartItems(defaultItems)
      calculateSubtotal(defaultItems)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const calculateSubtotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setSubtotal(total)
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return

    const updatedCart = cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))

    setCartItems(updatedCart)
    calculateSubtotal(updatedCart)

    // Update localStorage
    localStorage.setItem("cartItems", JSON.stringify(updatedCart))
  }

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedCart)
    calculateSubtotal(updatedCart)

    // Update localStorage
    localStorage.setItem("cartItems", JSON.stringify(updatedCart))
  }

  const handleContinue = () => {
    if (!agreedToTerms) {
      alert("Please agree to the Terms and Conditions")
      return
    }

    if (cartItems.length === 0) {
      alert("Votre panier est vide")
      return
    }

    // Ensure cart is saved to localStorage before redirecting
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
    router.push("/checkout")
  }

  const addToFavorites = (id) => {
    console.log(`Added item ${id} to favorites`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <PageContainer>
      <MainContent>
        {/* Tabs */}
        <TabsContainer>
          <Tab active={activeTab === "SHOPPING BAG"} onClick={() => setActiveTab("SHOPPING BAG")}>
            SHOPPING BAG
          </Tab>
          <Tab active={activeTab === "FAVOURITES"} onClick={() => setActiveTab("FAVOURITES")}>
            FAVOURITES
          </Tab>
        </TabsContainer>

        <ContentGrid>
          {/* Cart Items */}
          <CartItemsSection>
            {cartItems.map((item) => (
              <CartItemCard key={item.id}>
                <RemoveButton onClick={() => removeItem(item.id)}>
                  <FiX size={18} />
                </RemoveButton>

                <ItemImage>
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={200}
                    height={200}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </ItemImage>

                <ItemControls>
                  <ControlsLeft>
                    <SizeLabel>{item.size}</SizeLabel>
                    <ColorIndicator color={item.color} />
                  </ControlsLeft>

                  <QuantityControls>
                    <QuantityButton onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</QuantityButton>
                    <QuantityDisplay>{item.quantity}</QuantityDisplay>
                    <QuantityButton onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</QuantityButton>
                  </QuantityControls>

                  <ControlsRight>
                    <ActionButton>
                      <FiRefreshCw size={18} />
                    </ActionButton>
                    <ActionButton onClick={() => addToFavorites(item.id)}>
                      <FiHeart size={18} />
                    </ActionButton>
                  </ControlsRight>
                </ItemControls>

                <ItemInfo>
                  <ItemCategory>{item.category}</ItemCategory>
                  <ItemName>{item.name}</ItemName>
                  <ItemPrice>${item.price}</ItemPrice>
                </ItemInfo>
              </CartItemCard>
            ))}
          </CartItemsSection>

          {/* Order Summary */}
          <OrderSummarySection>
            <SummaryCard>
              <SummaryTitle>ORDER SUMMARY</SummaryTitle>

              <SummaryRow>
                <SummaryLabel>Subtotal</SummaryLabel>
                <SummaryValue>${subtotal}</SummaryValue>
              </SummaryRow>

              <SummaryRow>
                <SummaryLabel>Shipping</SummaryLabel>
                <SummaryValue>${shipping}</SummaryValue>
              </SummaryRow>

              <TotalRow>
                <TotalLabel>
                  TOTAL <TaxNote>(TAX INCL.)</TaxNote>
                </TotalLabel>
                <TotalValue>${subtotal + shipping}</TotalValue>
              </TotalRow>

              <TermsCheckbox>
                <CheckboxInput
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={() => setAgreedToTerms(!agreedToTerms)}
                />
                <CheckboxLabel htmlFor="terms">I agree to the Terms and Conditions</CheckboxLabel>
              </TermsCheckbox>

              <ContinueButton onClick={handleContinue}>CONTINUE</ContinueButton>
            </SummaryCard>
          </OrderSummarySection>
        </ContentGrid>
      </MainContent>
    </PageContainer>
  )
}

// Styled Components
const PageContainer = styled.div`
  background-color: #f9f9f9;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
`

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 2rem;
`

const Tab = styled.button`
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${(props) => (props.active ? "#000" : "transparent")};
  color: ${(props) => (props.active ? "#000" : "#999")};
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    color: ${(props) => (props.active ? "#000" : "#666")};
  }
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`

const CartItemsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const CartItemCard = styled.div`
  background-color: white;
  padding: 1rem;
  position: relative;
`

const RemoveButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
`

const ItemImage = styled.div`
  width: 100%;
  height: 250px;
  margin-bottom: 1rem;
  position: relative;
`

const ItemControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const ControlsLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const SizeLabel = styled.div`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  font-size: 0.875rem;
`

const ColorIndicator = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: ${(props) => props.color || "#000"};
`

const QuantityControls = styled.div`
  display: flex;
  flex-direction: column;
`

const QuantityButton = styled.button`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid #ddd;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
`

const QuantityDisplay = styled.div`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
`

const ControlsRight = styled.div`
  display: flex;
  gap: 0.5rem;
`

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  
  &:hover {
    color: #333;
  }
`

const ItemInfo = styled.div`
  margin-top: 0.5rem;
`

const ItemCategory = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
`

const ItemName = styled.div`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`

const ItemPrice = styled.div`
  font-size: 1rem;
  font-weight: 500;
  text-align: right;
`

const OrderSummarySection = styled.div`
  width: 100%;
`

const SummaryCard = styled.div`
  background-color: white;
  padding: 1.5rem;
`

const SummaryTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`

const SummaryLabel = styled.div`
  font-size: 0.875rem;
`

const SummaryValue = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
`

const TotalRow = styled(SummaryRow)`
  margin: 1.5rem 0;
`

const TotalLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
`

const TaxNote = styled.span`
  font-size: 0.75rem;
  font-weight: normal;
  color: #666;
`

const TotalValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
`

const TermsCheckbox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`

const CheckboxInput = styled.input`
  margin-right: 0.5rem;
`

const CheckboxLabel = styled.label`
  font-size: 0.75rem;
  color: #666;
`

const ContinueButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #e5e5e5;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #d5d5d5;
  }
`

