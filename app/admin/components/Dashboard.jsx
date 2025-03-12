"use client"

import styled from "styled-components"
import { FaHome, FaList, FaSignOutAlt, FaPlus } from "react-icons/fa"
import Link from "next/link"
import { usePathname } from "next/navigation"

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
`

const Sidebar = styled.div`
  width: 250px;
  background-color: #1E40AF; /* Bleu royal */
  color: white;
  padding: 20px 0;
`

const SidebarHeader = styled.div`
  padding: 0 20px 20px;
  border-bottom: 1px solid #3B82F6; /* Bleu clair */
`

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`

const Nav = styled.nav`
  margin-top: 20px;
`

const NavItem = styled.div`
  padding: 12px 20px;
  display: flex;
  align-items: center;
  color: ${(props) => (props.active ? "white" : "#93C5FD")}; /* Bleu clair pour inactif */
  background-color: ${(props) => (props.active ? "#1E3A8A" : "transparent")}; /* Bleu foncé pour actif */
  cursor: pointer;
  transition: all 0.3s;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};

  &:hover {
    background-color: #2563EB; /* Bleu moyen au survol */
    color: white;
  }
`

const NavItemText = styled.span`
  margin-left: 12px;
`

const Content = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #E0F2FE; /* Bleu très clair */
`

const Dashboard = ({ children }) => {
  const pathname = usePathname()

  return (
    <DashboardContainer>
      <Sidebar>
        <SidebarHeader>
          <Logo>Dashboard Admin</Logo>
        </SidebarHeader>

        <Nav>
          <Link href="/admin" passHref legacyBehavior>
            <NavItem as="a" active={pathname === "/admin"}>
              <FaHome size={16} />
              <NavItemText>Tableau de bord</NavItemText>
            </NavItem>
          </Link>

          <Link href="/admin/tableau" passHref legacyBehavior>
            <NavItem as="a" active={pathname === "/admin/tableau"}>
              <FaList size={16} />
              <NavItemText>Liste des produits</NavItemText>
            </NavItem>
          </Link>

          <Link href="/admin/ajouter" passHref legacyBehavior>
            <NavItem as="a" active={pathname === "/admin/ajouter"}>
              <FaPlus size={16} />
              <NavItemText>Ajouter un produit</NavItemText>
            </NavItem>
          </Link>

          <NavItem>
            <FaSignOutAlt size={16} />
            <NavItemText>Déconnexion</NavItemText>
          </NavItem>
        </Nav>
      </Sidebar>

      <Content>{children}</Content>
    </DashboardContainer>
  )
}

export default Dashboard
