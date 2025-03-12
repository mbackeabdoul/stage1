"use client"
import styled from "styled-components"
import Link from "next/link"
import { Search } from "lucide-react"

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 2rem;
  margin-top: 0.5rem;
  background-color: #f9f9f9;

    @media (max-width: 600px) {
  padding: 1rem;
`

const CategoryLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 1.5rem;
`

const CategoryLink = styled.a`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 1.125rem;
  letter-spacing: 0.5px;
`

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;

    @media (max-width: 600px) {
    margin-bottom: 0.5rem;

}

`

const SearchInput = styled.input`

 width: 319px;
  padding: 0.85rem 1rem 0.85rem 3rem;
  border-radius: 4px;
  border: none;
  background-color: #e5e5e5;
  font-size: 1rem;
  outline: none;
  
  &::placeholder {
    color: #666;
  }
`

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: black;
`

export default function Filtre() {
  return (
    <FilterContainer>
      <CategoryLinks>
        <Link href="/" passHref legacyBehavior>
          <CategoryLink>MEN</CategoryLink>
        </Link>
        <Link href="/" passHref legacyBehavior>
          <CategoryLink>WOMEN</CategoryLink>
        </Link>
        <Link href="/" passHref legacyBehavior>
          <CategoryLink>KIDS</CategoryLink>
        </Link>
      </CategoryLinks>

      <SearchContainer>
        <SearchIconWrapper>
          <Search size={20} strokeWidth={1.5} />
        </SearchIconWrapper>
        <SearchInput type="search" placeholder="Search" />
      </SearchContainer>
    </FilterContainer>
  )
}

