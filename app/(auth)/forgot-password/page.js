'use client';

import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import axios from 'axios';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

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
`;

const Message = styled.p`
  color: ${props => props.error ? 'red' : 'green'};
  margin-top: 10px;
`;

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
`;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage('Un email de réinitialisation a été envoyé');
      setIsError(false);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Une erreur est survenue');
      setIsError(true);
    }
  };

  return (
    <>
      <h2>Mot de passe oublié</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit">Réinitialiser</Button>
      </Form>
      {message && <Message error={isError}>{message}</Message>}
      <Links>
        <Link href="/login">Retour à la connexion</Link>
      </Links>
    </>
  );
}