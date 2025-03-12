import "../globals.css"
import StyledComponentsRegistry from "../lib/registry"
import Navbar from "../component/navbar"

import Navigation from "../component/navigation"
import Listefavoris from "./listeFavoris"

export const metadata = {
  title: "E-commerce Store",
  description: "E-commerce store with Next.js and Styled Component",
}

export default function Accueil() {
  return (
    <html lang="fr">
      <body>
        <StyledComponentsRegistry>
          <Navbar />

            <Listefavoris/>

         <div>
         <Navigation/> 
         </div>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
