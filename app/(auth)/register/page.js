"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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

    &:hover {
      text-decoration: underline;
    }
  }
`

const PageTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const user = sessionStorage.getItem("user")
    if (user) {
      router.push("/accueil")
    }
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setLoading(false)
      return
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", { name, email, password })
      router.push("/login?success=registration")
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Erreur lors de l'inscription")
      } else {
        setError("Impossible de contacter le serveur")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <PageTitle>Inscription</PageTitle>
      <Form onSubmit={handleSubmit}>
        <Input type="text" placeholder="Nom complet" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit" disabled={loading}>
          {loading ? "Inscription en cours..." : "S'inscrire"}
        </Button>
      </Form>
      <Links>
        <Link href="/login">Déjà un compte ? Se connecter</Link>
      </Links>
    </div>
  )
}

