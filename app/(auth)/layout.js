'use client';

import styled from 'styled-components';

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f0f2f5;
`;

const AuthWrapper = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 400px;
`;

export default function AuthLayout({ children }) {
  return (
    <AuthContainer>
      <AuthWrapper>
        {children}
      </AuthWrapper>
    </AuthContainer>
  );
}