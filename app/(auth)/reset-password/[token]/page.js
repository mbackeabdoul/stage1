// 'use client'

// import { useState, useEffect } from 'react'
// import axios from 'axios'
// import { useRouter } from 'next/navigation'
// import dynamic from 'next/dynamic'
// import styled from 'styled-components'

// const PageContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   min-height: 100vh;
//   text-align: center;
//   padding: 20px;
// `;

// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   width: 300px;
//   gap: 15px;
// `;

// const Input = styled.input`
//   padding: 10px;
//   border: 1px solid #ddd;
//   border-radius: 5px;
// `;

// const Button = styled.button`
//   display: inline-block;
//   padding: 10px 20px;
//   background-color: #000;
//   color: white;
//   text-decoration: none;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//   transition: background-color 0.3s;
  
//   &:hover {
//     background-color: #333;
//   }

//   &:disabled {
//     background-color: #ccc;
//     cursor: not-allowed;
//   }
// `;

// const Message = styled.p`
//   margin-top: 15px;
//   font-weight: bold;
// `;

// const ErrorMessage = styled(Message)`
//   color: red;
// `;

// const SuccessMessage = styled(Message)`
//   color: green;
// `;

// function ResetPasswordPage() {
//   const [isClient, setIsClient] = useState(false)
//   const [password, setPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [resetToken, setResetToken] = useState('')

//   const router = useRouter()

//   useEffect(() => {
//     // Uniquement exécuté côté client
//     setIsClient(true)
    
//     // Récupérer le token de l'URL
//     const urlParams = new URLSearchParams(window.location.search)
//     const token = urlParams.get('token')
    
//     if (token) {
//       setResetToken(token)
//     } else {
//       setError('Lien de réinitialisation invalide')
//     }
//   }, [])

//   const handleResetPassword = async (e) => {
//     e.preventDefault()
    
//     // Validation côté client
//     if (!isClient) return

//     setError('')
//     setSuccess('')

//     // Validation des mots de passe
//     if (password !== confirmPassword) {
//       setError('Les mots de passe ne correspondent pas')
//       return
//     }

//     if (password.length < 8) {
//       setError('Le mot de passe doit contenir au moins 8 caractères')
//       return
//     }

//     setIsLoading(true)

//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
//         token: resetToken,
//         newPassword: password
//       })

//       setSuccess('Mot de passe réinitialisé avec succès')
      
//       // Rediriger vers la page de connexion après 2 secondes
//       setTimeout(() => {
//         router.push('/auth/login')
//       }, 2000)
//     } catch (err) {
//       if (err.response) {
//         setError(err.response.data.message || 'Une erreur est survenue')
//       } else if (err.request) {
//         setError('Pas de réponse du serveur. Vérifiez votre connexion.')
//       } else {
//         setError('Erreur lors de la réinitialisation du mot de passe')
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Ne rien rendre côté serveur
//   if (!isClient) {
//     return null
//   }

//   return (
//     <PageContainer>
//       <h1>Réinitialisation de mot de passe</h1>
//       <Form onSubmit={handleResetPassword}>
//         <Input 
//           type="password" 
//           placeholder="Nouveau mot de passe" 
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required 
//         />
//         <Input 
//           type="password" 
//           placeholder="Confirmer le mot de passe" 
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           required 
//         />
//         <Button 
//           type="submit" 
//           disabled={isLoading || !resetToken}
//         >
//           {isLoading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
//         </Button>

//         {error && <ErrorMessage>{error}</ErrorMessage>}
//         {success && <SuccessMessage>{success}</SuccessMessage>}
//       </Form>
//     </PageContainer>
//   )
// }

// // Charger dynamiquement pour éviter le rendu côté serveur
// export default dynamic(() => Promise.resolve(ResetPasswordPage), {
//   ssr: false
// })
'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Button = styled.button`
  display: inline-block;
  padding: 10px 20px;
  background-color: #000;
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #333;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  margin-top: 15px;
  font-weight: bold;
`;

const ErrorMessage = styled(Message)`
  color: red;
`;

const SuccessMessage = styled(Message)`
  color: green;
`;

export default function ResetPasswordPage({ params }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const resetToken = params.token

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation des mots de passe
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post('https://projets1-back-3.onrender.com/api/auth/reset-password', {
        token: resetToken,
        newPassword: password
      })

      setSuccess('Mot de passe réinitialisé avec succès')
      
      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Une erreur est survenue')
      } else if (err.request) {
        setError('Pas de réponse du serveur. Vérifiez votre connexion.')
      } else {
        setError('Erreur lors de la réinitialisation du mot de passe')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageContainer>
      <h1>Réinitialisation de mot de passe</h1>
      <Form onSubmit={handleResetPassword}>
        <Input 
          type="password" 
          placeholder="Nouveau mot de passe" 
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
        <Button 
          type="submit" 
          disabled={isLoading || !resetToken}
        >
          {isLoading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
        </Button>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
      </Form>
    </PageContainer>
  )
}
