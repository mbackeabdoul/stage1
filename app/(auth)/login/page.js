"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import styled from "styled-components"
import axios from "axios"

const PageContainer = styled.div`
  max-width: 500px;
  margin: 40px auto;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background-color: white;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  font-weight: 500;
  color: #333;
  font-size: 15px;
`

const Input = styled.input`
  padding: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: #0070f3;
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.1);
  }
`

const PasswordContainer = styled.div`
  position: relative;
  width: 100%;
`

const ToggleButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #666;
`

const Button = styled.button`
  padding: 14px;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0060df;
  }
  
  &:disabled {
    background-color: #9dc3f5;
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.p`
  color: #e53e3e;
  margin-top: 5px;
  font-size: 14px;
  font-weight: 500;
`

const Links = styled.div`
  margin-top: 25px;
  text-align: center;
  display: flex;
  justify-content: space-between;

  a {
    color: #0070f3;
    text-decoration: none;
    font-size: 15px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

const PageTitle = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 28px;
  font-weight: 600;
`

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #666;
`

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingIndicator>Chargement...</LoadingIndicator>}>
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

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const user = sessionStorage.getItem("user")
    if (user) {
      try {
        const userData = JSON.parse(user)
        if (userData.email === "adminexemple@gmail.com") {
          router.push("/admin")
        } else {
          router.push(callbackUrl)
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
        router.push(callbackUrl)
      }
    }
  }, [callbackUrl, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Vérifier si c'est l'admin
    if (email === "admin@exemplegmail.com" && password === "admin123") {
      // Créer un compte admin
      const adminUser = {
        email: "admin@exemplegmail.com",
        name: "Administrator",
        role: "admin",
      }
      
      // Stocker les données admin dans sessionStorage
      sessionStorage.setItem("token", "admin-token")
      sessionStorage.setItem("user", JSON.stringify(adminUser))
      
      // Redirection vers la page admin
      setTimeout(() => {
        router.push("/admin")
      }, 500)
      
      return
    }

    try {
      const response = await axios.post("https://projets1-back-3.onrender.com/api/auth/login", { email, password })

      // Stocker le token et les données utilisateur dans sessionStorage
      sessionStorage.setItem("token", response.data.token)
      sessionStorage.setItem("user", JSON.stringify(response.data))

      // Rediriger vers la page demandée ou l'accueil
      router.push("/accueil")
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

  return (
    <PageContainer>
      <PageTitle>Connexion</PageTitle>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="email">Adresse email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError(null)
            }}
            required
          />
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="password">Mot de passe</Label>
          <PasswordContainer>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(null)
              }}
              required
            />
            <ToggleButton 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? "👁️" : "🔒"}
            </ToggleButton>
          </PasswordContainer>
        </InputGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Button type="submit" disabled={loading}>
          {loading ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </Form>
      
      <Links>
        <Link href="/register">Créer un compte</Link>
        <Link href="/forgot-password">Mot de passe oublié ?</Link>
      </Links>
    </PageContainer>
  )
}