// import { Inter } from "next/font/google"
// import "../globals.css"
import  StyledComponentsRegistry  from "../lib/registry"



export const metadata = {
  title: "Product Management System",
  description: "Manage your products with ease",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}

