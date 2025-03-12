"use client"
import { useState, useEffect } from "react"
import styled from "styled-components"
import Image from "next/image"
import { ChevronDown, Plus } from "lucide-react"

const CollectionContainer = styled.section`
  padding: 2rem;
  background-color: #f9f9f9;

  @media (max-width: 600px) {
    padding: 1rem;
  }
`

const CollectionHeader = styled.div`
  margin-bottom: 2rem;

  @media (max-width: 600px) {
    margin-bottom: 1rem;
  }
`

const CollectionTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  text-transform: uppercase;
  line-height: 1;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
  border-bottom: 1px solid #eee;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 15px;
  }
`

const CategoryFilters = styled.div`
  display: flex;
  gap: 2rem;
`

const CategoryLink = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 0;
  color: ${(props) => (props.active ? "#000" : "#999")};
  font-weight: ${(props) => (props.active ? "500" : "400")};
  
  &:hover {
    color: #000;
  }
`

const SortFilters = styled.div`
  display: flex;
  gap: 2rem;
`

const FilterButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
`

const SortDropdown = styled.div`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  flex-direction: column;
  align-items: flex-end;
`

const SortOption = styled.button`
  background: none;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.15rem 0;
  text-align: right;
  color: #666;
  
  &:hover {
    color: #000;
  }
`

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
`

const ProductImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background-color: #f5f6fa;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
`

const AddButton = styled.button`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ProductInfo = styled.div`
  padding: 0.5rem 0;
`

const ProductCategory = styled.div`
  font-size: 0.875rem;
  color: #666;
`

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin: 0.25rem 0;
`

const ProductPrice = styled.div`
  font-size: 1rem;
  font-weight: 500;
`

const ColorOptions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
`

const ColorVariant = styled.div`
  font-size: 0.75rem;
  color: #999;
  background-color: #f0f0f0;
  padding: 0.1rem 0.3rem;
`

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
`

const LoadMoreButton = styled.button`
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #000;
  }
`

const Disposition = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`

const Disposition1 = styled.div`
  display: flex;
  gap: 6px;
  justify-content: space-between;
`

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #333;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

// Categories - you can adjust these based on your actual categories
const categories = ["ALL", "Men", "Women", "KID"]

// Sort options
const sortOptions = ["Less to more", "More to Less"]

export default function CollectionPage() {
  // State for products
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // State for filters
  const [activeCategory, setActiveCategory] = useState("ALL")
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [activeSort, setActiveSort] = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Fetch products from API
  const fetchProducts = async (pageNum = 1, reset = false) => {
    setLoading(true)
    try {
      // Fetch all products from the API
      const response = await fetch("http://localhost:5000/api/products")

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      // Filter and sort products on the client side
      let filteredProducts = [...data]

      // Apply category filter if not "ALL"
      if (activeCategory !== "ALL") {
        const categoryMap = {
          Men: "Homme",
          Women: "Femme",
          KID: "Enfant",
        }

        const apiCategory = categoryMap[activeCategory]
        if (apiCategory) {
          filteredProducts = filteredProducts.filter((p) => p.genre === apiCategory)
        }
      }

      // Apply sorting
      if (activeSort === "Less to more") {
        filteredProducts.sort((a, b) => a.price - b.price)
      } else if (activeSort === "More to Less") {
        filteredProducts.sort((a, b) => b.price - a.price)
      }

      // Apply pagination
      const limit = 6 // Number of products per page
      const startIndex = (pageNum - 1) * limit
      const endIndex = startIndex + limit
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

      // Check if there are more products
      const moreAvailable = endIndex < filteredProducts.length

      setHasMore(moreAvailable)

      // Update products state
      if (reset) {
        setProducts(paginatedProducts)
      } else {
        setProducts((prev) => [...prev, ...paginatedProducts])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      // Handle error state here if needed
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchProducts(1, true)
  }, [activeCategory, activeSort])

  // Handle load more
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchProducts(nextPage)
    }
  }

  // Handle category change
  const handleCategoryChange = (category) => {
    if (category !== activeCategory) {
      setActiveCategory(category)
      setPage(1)
    }
  }

  // Handle sort change
  const handleSortChange = (sort) => {
    setActiveSort(sort)
    setSortDropdownOpen(false)
    setPage(1)
  }

  // Toggle sort dropdown
  const toggleSortDropdown = () => {
    setSortDropdownOpen(!sortDropdownOpen)
  }

  // Toggle filters
  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen)
  }

  // Add to cart function - implement your cart logic here
  const addToCart = (productId) => {
    console.log(`Adding product ${productId} to cart`)
    // Call your cart API or update local state
  }

  return (
    <CollectionContainer>
      <CollectionHeader>
        <CollectionTitle>
          XIV
          <br />
          COLLECTIONS
          <br />
          23-24
        </CollectionTitle>
      </CollectionHeader>

      <FilterContainer>
        <CategoryFilters>
          {categories.map((category) => (
            <CategoryLink
              key={category}
              active={activeCategory === category}
              onClick={() => handleCategoryChange(category)}
            >
              {category === "ALL" ? "(ALL)" : category}
            </CategoryLink>
          ))}
        </CategoryFilters>

        <SortFilters>
          <FilterButton onClick={toggleFilters}>Filters({filtersOpen ? "-" : "+"})</FilterButton>
          <div>
            <FilterButton onClick={toggleSortDropdown}>Sorts({sortDropdownOpen ? "-" : "+"})</FilterButton>
            <SortDropdown isOpen={sortDropdownOpen}>
              {sortOptions.map((option) => (
                <SortOption key={option} onClick={() => handleSortChange(option)}>
                  {option}
                </SortOption>
              ))}
            </SortDropdown>
          </div>
        </SortFilters>
      </FilterContainer>

      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product._id}>
            <ProductImageContainer>
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
              <AddButton aria-label="Add to cart" onClick={() => addToCart(product._id)}>
                <Plus size={24} />
              </AddButton>
            </ProductImageContainer>

            <ProductInfo>
              <Disposition>
                <ProductCategory>{product.category}</ProductCategory>
                {product.color && (
                  <ColorOptions>
                    <ColorVariant>{product.color}</ColorVariant>
                  </ColorOptions>
                )}
              </Disposition>

              <Disposition1>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>${product.price}</ProductPrice>
              </Disposition1>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>

      {loading && <LoadingSpinner />}

      {hasMore && !loading && (
        <LoadMoreContainer>
          <LoadMoreButton onClick={handleLoadMore}>
            More
            <ChevronDown size={20} />
          </LoadMoreButton>
        </LoadMoreContainer>
      )}
    </CollectionContainer>
  )
}

