import "./globals.css"
import StyledComponentsRegistry from "./lib/registry"
export const metadata = {
  title: "E-commerce Store",
  description: "E-commerce store with Next.js and Styled Components",
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <StyledComponentsRegistry>


          {children}

          
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}

