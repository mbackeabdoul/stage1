"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import StyledComponentsRegistry from "../lib/registry"
import Navbar from "../component/navbar"
import Filtre from "../component/Filtre"
import NewCollectionHero from "../hero/NewCollectionHero"
import NewThisWeek from "../component/new-this-week"
import CollectionPage from "../component/collection-pagee"
import FashionGrid from "../component/fashion-grid"
import Navigation from "../component/navigation"
import Description from "../component/description"

export default function Accueil() {
  const router = useRouter()

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const user = sessionStorage.getItem("user")
    const token = sessionStorage.getItem("token")

    if (!user || !token) {
      router.push("/login")
    }
  }, [router])

  return (
    <html lang="fr">
      <body>
        <StyledComponentsRegistry>
          <Navbar />
          <Filtre />
          <NewCollectionHero />
          <NewThisWeek />
          <CollectionPage />
          <Description />
          <FashionGrid />

          <div>
            <Navigation />
          </div>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}

