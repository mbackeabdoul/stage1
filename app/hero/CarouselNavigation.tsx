"use client"
import styled from "styled-components"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselNavigationProps {
  onPrevious: () => void
  onNext: () => void
}

const NavigationContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #999;
  }
`

export default function CarouselNavigation({ onPrevious, onNext }: CarouselNavigationProps) {
  return (
    <NavigationContainer>
      <NavButton onClick={onPrevious} aria-label="Previous slide">
        <ChevronLeft size={20} />
      </NavButton>
      <NavButton onClick={onNext} aria-label="Next slide">
        <ChevronRight size={20} />
      </NavButton>
    </NavigationContainer>
  )
}

