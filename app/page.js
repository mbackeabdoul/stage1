"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.replace("./accueil"); // Redirige vers la page d'accueil si le token est présent
    } else {
      router.replace("./login"); // Sinon, redirige vers la page de connexion
    }
  }, [router]);

  return <Main>Chargement...</Main>;
}

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 20px;
  font-weight: bold;
`;
