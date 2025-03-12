"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import styled from "styled-components"
import axios from "axios"

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
`

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
`

const Button = styled.button`
  padding: 12px;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #333;
  }
`

const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
`

const Links = styled.div`
  margin-top: 15px;
  text-align: center;

  a {
    color: #000;
    text-decoration: none;
    margin: 0 10px;

    &:hover {
      text-decoration: underline;
    }
  }
`

const PageTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-10">Chargement...</div>}>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/accueil"
  const [cartItems, setCartItems] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const user = sessionStorage.getItem("user")
    if (user) {
      router.push(callbackUrl)
    }
  }, [callbackUrl, router])

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
        }
      }
    } catch (error) {
      console.error("Error loading cart data:", error)
    }
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password })

      // Stocker le token et les données utilisateur dans sessionStorage
      sessionStorage.setItem("token", response.data.token)
      sessionStorage.setItem("user", JSON.stringify(response.data))

      // Rediriger vers la page demandée ou l'accueil
      router.push(callbackUrl)
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Erreur lors de la connexion")
      } else if (err.request) {
        setError("Impossible de contacter le serveur. Vérifiez votre connexion.")
      } else {
        setError("Une erreur inconnue est survenue")
      }
    } finally {
      setLoading(false)
    }
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

  const calculateSubtotal = (cart) => {
    const newSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    setSubtotal(newSubtotal)
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

  return (
    <div className="container mx-auto py-10">
      <PageTitle>Connexion</PageTitle>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError(null)
          }}
          required
        />
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(null)
            }}
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "👀" : "🔒"}
          </button>
        </div>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit" disabled={loading}>
          {loading ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </Form>
      <Links>
        <Link href="/register">Créer un compte</Link>
        <Link href="/forgot-password">Mot de passe oublié ?</Link>
      </Links>
    </div>
  )
}