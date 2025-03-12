"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import { ChevronDown, Plus } from "lucide-react";

// Main container with a subtle gradient
const CollectionContainer = styled.section`
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin: 2rem 0;

  @media (max-width: 600px) {
    padding: 1.5rem 1rem;
    margin: 1rem 0;
  }
`;

// Header with refined spacing
const CollectionHeader = styled.div`
  margin-bottom: 2.5rem;

  @media (max-width: 600px) {
    margin-bottom: 1.5rem;
  }
`;

// Bold, modern title with hover animation
const CollectionTitle = styled.h1`
  font-size: 3.75rem;
  font-weight: 900;
  text-transform: uppercase;
  line-height: 1.1;
  margin: 0;
  color: #1a1a1a;
  transition: color 0.3s ease;

  &:hover {
    color: #3a3af4;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

// Filter container with a clean border
const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e5e5;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

// Category filters with smooth transitions
const CategoryFilters = styled.div`
  display: flex;
  gap: 2.5rem;
`;

const CategoryLink = styled.button`
  background: none;
  border: none;
  font-size: 1.125rem;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  color: ${(props) => (props.active ? "#3a3af4" : "#666")};
  cursor: pointer;
  padding: 0.5rem 0;
  transition: color 0.3s ease;

  &:hover {
    color: #3a3af4;
  }
`;

// Sort filters with a modern layout
const SortFilters = styled.div`
  display: flex;
  gap: 2rem;
  position: relative;
`;

const FilterButton = styled.button`
  background: none;
  border: none;
  font-size: 1.125rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #3a3af4;
  }
`;

// Dropdown with a sleek slide-in effect
const SortDropdown = styled.div`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  flex-direction: column;
  position: absolute;
  top: 100%;
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.2s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SortOption = styled.button`
  background: none;
  border: none;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
  padding: 0.25rem 1rem;
  text-align: right;
  transition: color 0.3s ease;

  &:hover {
    color: #3a3af4;
  }
`;

// Responsive product grid
const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

// Product card with hover effect
const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

// Image container with consistent sizing
const ProductImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background-color: #f5f6fa;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.75rem;
`;

// Add button with a circular design
const AddButton = styled.button`
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: #3a3af4;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1a1af4;
  }
`;

// Product info with clean padding
const ProductInfo = styled.div`
  padding: 1rem;
`;

// Subtle category text
const ProductCategory = styled.div`
  font-size: 0.875rem;
  color: #666;
  text-transform: uppercase;
`;

// Bold product name
const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0.5rem 0;
  color: #1a1a1a;
`;

// Price with a standout color
const ProductPrice = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #3a3af4;
`;

// Color options with a sleek look
const ColorOptions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ColorVariant = styled.div`
  font-size: 0.75rem;
  color: #666;
  background-color: #f0f0f0;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
`;

// Load more container with centered alignment
const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3.5rem;
`;

// Stylish load more button
const LoadMoreButton = styled.button`
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: #666;
  font-size: 1.125rem;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #3a3af4;
  }
`;

// Flex containers for alignment
const Disposition = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Disposition1 = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
  align-items: center;
`;

// Enhanced loading spinner
const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3a3af4;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 2rem auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Categories and sort options
const categories = ["ALL", "Men", "Women", "KID"];
const sortOptions = ["Less to more", "More to Less"];

export default function CollectionPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [activeSort, setActiveSort] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Fetch products from API
  const fetchProducts = async (pageNum = 1, reset = false) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();

      let filteredProducts = [...data];

      // Apply category filter
      if (activeCategory !== "ALL") {
        const categoryMap = { Men: "Homme", Women: "Femme", KID: "Enfant" };
        const apiCategory = categoryMap[activeCategory];
        if (apiCategory) filteredProducts = filteredProducts.filter((p) => p.genre === apiCategory);
      }

      // Apply sorting
      if (activeSort === "Less to more") filteredProducts.sort((a, b) => a.price - b.price);
      else if (activeSort === "More to Less") filteredProducts.sort((a, b) => b.price - a.price);

      // Pagination
      const limit = 6;
      const startIndex = (pageNum - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      setHasMore(endIndex < filteredProducts.length);
      setProducts((prev) => (reset ? paginatedProducts : [...prev, ...paginatedProducts]));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and filter updates
  useEffect(() => {
    fetchProducts(1, true);
  }, [activeCategory, activeSort]);

  // Handlers
  const handleLoadMore = () => !loading && hasMore && setPage((prev) => prev + 1) && fetchProducts(page + 1);
  const handleCategoryChange = (category) => {
    if (category !== activeCategory) {
      setActiveCategory(category);
      setPage(1);
    }
  };
  const handleSortChange = (sort) => {
    setActiveSort(sort);
    setSortDropdownOpen(false);
    setPage(1);
  };
  const toggleSortDropdown = () => setSortDropdownOpen((prev) => !prev);
  const toggleFilters = () => setFiltersOpen((prev) => !prev);
  const addToCart = (productId) => console.log(`Adding product ${productId} to cart`);

  return (
    <CollectionContainer>
      <CollectionHeader>
        <CollectionTitle>
          XIV <br /> COLLECTIONS <br /> 23-24
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
          <FilterButton onClick={toggleFilters}>
            Filters ({filtersOpen ? "-" : "+"})
          </FilterButton>
          <div>
            <FilterButton onClick={toggleSortDropdown}>
              Sorts ({sortDropdownOpen ? "-" : "+"})
            </FilterButton>
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
  );
}