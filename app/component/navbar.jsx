"use client";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, User, X, LogOut } from "lucide-react";
import { TfiAlignLeft } from "react-icons/tfi";

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
`;

const TopNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-left: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  text-decoration: none;
  color: #333;
  font-weight: 400;
  font-size: 1rem;
  position: relative;
  cursor: pointer;

  &:hover {
    color: #000;
  }
`;

const NewDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 300px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 1rem;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const NewItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f5f5f5;
  }
`;

const NewItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

const NewItemName = styled.div`
  font-size: 0.9rem;
  color: #333;
`;

const NewItemPrice = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const CircleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #222;
  border: none;
  cursor: pointer;
  position: relative;
  color: white;

  &:hover {
    background-color: #333;
  }

  &.wishlist {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #333;
`;

const CartButton = styled.div`
  display: flex;
  align-items: center;
  height: 48px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileCartButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid #000;
  cursor: pointer;
  color: #000;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const CartContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  color: white;
  cursor: pointer;
`;

const CartText = styled.span`
  padding: 15px 20px 15px 20px;
  background-color: #222;
  border-radius: 24px;
  font-weight: 700;
`;

const CartIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 9px;
  border-radius: 50%;
  background-color: white;
  color: black;
  border: 5px solid black;
`;

const RotatedHeart = styled(Heart)`
  transform: rotate(-12deg);
  color: white;
`;

const Logo = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RightSection = styled(NavSection)`
  gap: 1rem;
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transform: translateX(${(props) => (props.isOpen ? "0" : "100%")});
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  padding: 2rem;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
`;

const SidebarNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SidebarNavLink = styled.a`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 1.2rem;
  padding: 0.5rem 0;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  font-weight: 500;
  padding: 0.75rem;
  width: 100%;
  text-align: left;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const UserInfoContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const UserPopup = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  width: 200px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const UserPopupHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const UserName = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
  color: #000;
`;

const UserEmail = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
`;

const PopupLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  text-decoration: none;
  color: #333;
  font-size: 0.9rem;

  &:hover {
    background-color: #f5f5f5;
  }
`;

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userPopupOpen, setUserPopupOpen] = useState(false);
  const [newDropdownOpen, setNewDropdownOpen] = useState(false);
  const [latestProducts, setLatestProducts] = useState([]);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const popupRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    }
  }, []);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/products?sort=latest&limit=5", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch latest products");
        }
        const data = await response.json();
        setLatestProducts(data);
      } catch (error) {
        console.error("Error fetching latest products:", error);
      }
    };

    fetchLatestProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setUserPopupOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNewDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      setUser(null);
    }
    setUserPopupOpen(false);
    router.push("/login");
  };

  const toggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const toggleUserPopup = () => {
    setUserPopupOpen(!userPopupOpen);
  };

  const toggleNewDropdown = () => {
    setNewDropdownOpen(!newDropdownOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined" && window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <HeaderContainer>
      <TopNav>
        <NavSection>
          <MenuButton aria-label="Menu" onClick={toggleSidebar}>
            <TfiAlignLeft size={24} />
          </MenuButton>

          <NavLinks>
            <Link href="/accueil" passHref legacyBehavior>
              <NavLink>Home</NavLink>
            </Link>
            <Link href="/products" passHref legacyBehavior>
              <NavLink>Collections</NavLink>
            </Link>
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <Link href="/new" passHref legacyBehavior>
                <NavLink onClick={toggleNewDropdown}>New</NavLink>
              </Link>
              <NewDropdown isOpen={newDropdownOpen}>
                {latestProducts.length > 0 ? (
                  latestProducts.map((product) => (
                    <Link href={`/details?id=${product._id}`} key={product._id} passHref legacyBehavior>
                      <NewItem onClick={() => setNewDropdownOpen(false)}>
                        <NewItemImage src={product.image || "/placeholder.svg"} alt={product.name} />
                        <div>
                          <NewItemName>{product.name}</NewItemName>
                          <NewItemPrice>${product.price}</NewItemPrice>
                        </div>
                      </NewItem>
                    </Link>
                  ))
                ) : (
                  <NewItem>Aucun nouveau produit</NewItem>
                )}
              </NewDropdown>
            </div>
          </NavLinks>
        </NavSection>

        <Logo>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19L2 12L12 5Z" fill="#E5E5E5" />
            <path d="M12 5V19L22 12L12 5Z" fill="#000000" />
          </svg>
        </Logo>

        <RightSection>
          <CircleButton aria-label="Wishlist" className="wishlist">
            <Link href="/favoris">
              <RotatedHeart size={20} strokeWidth={1.5} />
            </Link>
          </CircleButton>

          <Link href="/cart" passHref>
            <CartButton>
              <CartContainer>
                <CartText>Cart</CartText>
                <CartIconContainer>
                  <ShoppingBag size={18} strokeWidth={1.5} />
                </CartIconContainer>
              </CartContainer>
            </CartButton>
          </Link>

          <Link href="/cart" passHref>
            <MobileCartButton aria-label="Cart">
              <ShoppingBag size={20} strokeWidth={1.5} />
            </MobileCartButton>
          </Link>

          <UserInfoContainer ref={popupRef}>
            <CircleButton aria-label="Account" onClick={user ? toggleUserPopup : () => router.push("/login")}>
              <User size={20} strokeWidth={1.5} />
            </CircleButton>
            {user && (
              <UserPopup isOpen={userPopupOpen}>
                <UserPopupHeader>
                  <UserName>{user.name || "Utilisateur"}</UserName>
                  <UserEmail>{user.email || ""}</UserEmail>
                </UserPopupHeader>
                <LogoutButton onClick={handleLogout}>
                  <LogOut size={16} />
                  Déconnexion
                </LogoutButton>
              </UserPopup>
            )}
          </UserInfoContainer>
        </RightSection>
      </TopNav>

      <Overlay $isOpen={sidebarOpen} onClick={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen}>
        <SidebarHeader>
          <h2>Menu</h2>
          <CloseButton onClick={toggleSidebar}>
            <X size={24} />
          </CloseButton>
        </SidebarHeader>
        <SidebarNavLinks>
          <Link href="/accueil" passHref legacyBehavior>
            <SidebarNavLink onClick={toggleSidebar}>Home</SidebarNavLink>
          </Link>
          <Link href="/products" passHref legacyBehavior>
            <SidebarNavLink onClick={toggleSidebar}>Collections</SidebarNavLink>
          </Link>
          <Link href="/new" passHref legacyBehavior>
            <SidebarNavLink onClick={toggleSidebar}>New</SidebarNavLink>
          </Link>
          {user && (
            <LogoutButton onClick={handleLogout}>
              <LogOut size={16} />
              Déconnexion
            </LogoutButton>
          )}
        </SidebarNavLinks>
      </Sidebar>
    </HeaderContainer>
  );
}