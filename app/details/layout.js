// import { Inter } from "next/font/google"
// import "../globals.css"
import StyledComponentsRegistry from "../lib/registry"
import Navbar from "../component/navbar"
import Navigation from "../component/navigation"
import { Suspense } from "react";


export const metadata = {
  title: "Product Management System",
  description: "Manage your products with ease",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <StyledComponentsRegistry>
          <Navbar />
          <Suspense fallback={<div>Chargement...</div>}>
            {children}
          </Suspense>
          <Navigation />
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}

