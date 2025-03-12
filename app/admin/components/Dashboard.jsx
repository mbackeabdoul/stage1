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
  background-color: #1a202c;
  color: white;
  padding: 20px 0;
`

const SidebarHeader = styled.div`
  padding: 0 20px 20px;
  border-bottom: 1px solid #2d3748;
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
  color: ${(props) => (props.active ? "white" : "#a0aec0")};
  background-color: ${(props) => (props.active ? "#2d3748" : "transparent")};
  cursor: pointer;
  transition: all 0.3s;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};

  &:hover {
    background-color: #2d3748;
    color: white;
  }
`

const NavItemText = styled.span`
  margin-left: 12px;
`

const Content = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f7fafc;
`

const Dashboard = ({ children }) => {
  const pathname = usePathname()

  return (
    <DashboardContainer>
      <Sidebar>
        <SidebarHeader>
          <Logo>Admin Panel</Logo>
        </SidebarHeader>
        <Nav>
          <Link href="/admin" passHref legacyBehavior>
            <NavItem as="a" active={pathname === "/"}>
              <FaHome size={16} />
              <NavItemText>Tableau de bord</NavItemText>
            </NavItem>
          </Link>
          <Link href="/admin/tableau" passHref legacyBehavior>
            <NavItem as="a" active={pathname === "/products"}>
              <FaList size={16} />
              <NavItemText>Liste des produits</NavItemText>
            </NavItem>
          </Link>
          <Link href="/admin" passHref legacyBehavior>
            <NavItem as="a" active={pathname === "/add-product"}>
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

