"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, ChevronRight, X } from "lucide-react";
import styled from "styled-components";

// Only styling the ProductCard component
const ProductCard = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 350px;
  background-color: #f5f6fa;
  border-bottom: 1px solid #eee;
`;

const ProductImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
`;

const ProductCategory = styled.div`
  font-size: 0.875rem;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0.25rem 0;
  line-height: 1.2;
`;

const ProductPrice = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #3a3af4;
  margin-top: 0.5rem;
`;

// Rest of your original styled components remain unchanged
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #000;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: #666;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const ErrorMessage = styled.p`
  font-size: 16px;
  color: #e53e3e;
  margin-bottom: 20px;
`;

const RetryButton = styled.button`
  padding: 8px 16px;
  background-color: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #333;
  }
`;

const ActiveFiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

const ActiveFiltersTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const ActiveFiltersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
`;

const ActiveFilterTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background-color: #e5e5e5;
  border-radius: 4px;
  font-size: 13px;
`;

const FilterTagRemove = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #000;
  }
`;

const ClearFiltersButton = styled.button`
  padding: 4px 10px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  
  &:hover {
    background-color: #000;
  }
`;

const PageContainer = styled.div`
  font-family: 'Inter', sans-serif;
  background-color: #f9f9f9;
  min-height: 100vh;
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 40px;
`;

const BreadcrumbContainer = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

const BreadcrumbLink = styled(Link)`
  color: #666;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  width: 220px;
  min-width: 220px;
  
  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
  }
`;

const SidebarTitle = styled.h2`
  font-size: 14px;
  margin-bottom: 25px;
  font-weight: 500;
  color: #333;
  text-transform: uppercase;
`;

const FilterSection = styled.div`
  margin-bottom: 20px;
`;

const FilterTitle = styled.h3`
  font-size: 13px;
  margin-bottom: 12px;
  font-weight: 500;
  color: #333;
`;

const SizeGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SizeButton = styled.button`
  width: 35px;
  height: 35px;
  border: 1px solid #ddd;
  background-color: ${(props) => (props.active ? "#333" : "#fff")};
  color: ${(props) => (props.active ? "#fff" : "#333")};
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    border-color: #999;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 12px;
`;

const ExpandIcon = styled.div`
  color: #666;
  display: flex;
  align-items: center;
  font-size: 18px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 14px;
  height: 14px;
  margin: 0;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 13px;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ColorSwatch = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  border: 1px solid #ddd;
`;

const Count = styled.span`
  color: #0066cc;
  font-size: 13px;
  margin-left: auto;
`;

const FilterAccordion = styled.div`
  margin-bottom: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;

  &:first-of-type {
    border-top: none;
    padding-top: 0;
  }
`;

const PriceRangeContainer = styled.div`
  margin-bottom: 15px;
`;

const PriceInputs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

const PriceInput = styled.input`
  width: 80px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  font-size: 13px;
`;

const PriceRangeSeparator = styled.span`
  color: #666;
`;

const PriceRangeSlider = styled.div`
  padding: 10px 0;
`;

const PriceRangeTrack = styled.div`
  position: relative;
  height: 4px;
  background-color: #ddd;
  border-radius: 2px;
`;

const PriceRangeFill = styled.div`
  position: absolute;
  height: 100%;
  background-color: #333;
  border-radius: 2px;
`;

const ProductsContainer = styled.div`
  flex: 1;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 0;
  padding: 12px 15px;
  margin-bottom: 20px;
  width: 100%;
  position: relative;
`;

const SearchIcon = styled.div`
  color: #666;
  margin-right: 10px;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  width: 100%;
  font-size: 16px;
  outline: none;
  color: #333;
  
  &::placeholder {
    color: #999;
  }
`;

const ClearSearchButton = styled.button`
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #000;
  }
`;

const CategoryTabsContainer = styled.div`
  margin-bottom: 30px;
`;

const CategoryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 5px;
  }
`;

const CategoryTab = styled.button`
  padding: 8px 15px;
  border: 1px solid #ddd;
  background-color: #fff;
  font-size: 12px;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: ${(props) => (props.active ? "600" : "normal")};
  color: #333;
  
  &:hover {
    background-color: #f9f9f9;
  }
`;

const ResultsCount = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const NoResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  text-align: center;
`;

const NoResultsMessage = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
`;

export default function Products() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    size: null,
    availability: [],
    category: [],
    color: [],
    priceRange: { min: 0, max: 1000 },
    genre: [],
    rating: null,
  });
  const [expandedSections, setExpandedSections] = useState({
    availability: true,
    category: false,
    color: false,
    priceRange: false,
    collections: false,
    tags: false,
    ratings: false,
    genre: false,
  });

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("token");

    if (!user || !token) {
      router.push("/login?callbackUrl=/products");
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 401) {
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
            router.push("/login?callbackUrl=/products");
            return;
          }
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);

        const categories = [...new Set(data.map((product) => product.category))].filter(Boolean);
        const colors = [...new Set(data.map((product) => product.color))].filter(Boolean);
        const sizes = [...new Set(data.map((product) => product.size))].filter(Boolean);
        const genres = [...new Set(data.map((product) => product.genre))].filter(Boolean);

        setAvailableCategories(categories);
        setAvailableColors(colors);
        setAvailableSizes(sizes);
        setAvailableGenres(genres);

        setFilteredProducts(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchProducts();

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [router]);

  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term) ||
          product.category?.toLowerCase().includes(term)
      );
    }

    if (activeFilters.size) result = result.filter((product) => product.size === activeFilters.size);
    if (activeFilters.availability.includes("outOfStock"))
      result = result.filter((product) => product.stock === 0 || product.stock === undefined);
    if (activeFilters.category.length > 0)
      result = result.filter((product) => activeFilters.category.includes(product.category));
    if (activeFilters.color.length > 0)
      result = result.filter((product) => activeFilters.color.includes(product.color));
    if (activeFilters.genre.length > 0)
      result = result.filter((product) => activeFilters.genre.includes(product.genre));
    result = result.filter(
      (product) => product.price >= activeFilters.priceRange.min && product.price <= activeFilters.priceRange.max
    );

    setFilteredProducts(result);
  }, [products, activeFilters, searchTerm]);

  const handleSizeClick = (size) =>
    setActiveFilters((prev) => ({ ...prev, size: prev.size === size ? null : size }));

  const handleAvailabilityClick = (option) =>
    setActiveFilters((prev) => {
      const newAvailability = [...prev.availability];
      if (newAvailability.includes(option)) {
        return { ...prev, availability: newAvailability.filter((item) => item !== option) };
      } else {
        return { ...prev, availability: [...newAvailability, option] };
      }
    });

  const handleCategoryClick = (category) =>
    setActiveFilters((prev) => {
      const newCategories = [...prev.category];
      if (newCategories.includes(category)) {
        return { ...prev, category: newCategories.filter((item) => item !== category) };
      } else {
        return { ...prev, category: [...newCategories, category] };
      }
    });

  const handleColorClick = (color) =>
    setActiveFilters((prev) => {
      const newColors = [...prev.color];
      if (newColors.includes(color)) {
        return { ...prev, color: newColors.filter((item) => item !== color) };
      } else {
        return { ...prev, color: [...newColors, color] };
      }
    });

  const handleGenreClick = (genre) =>
    setActiveFilters((prev) => {
      const newGenres = [...prev.genre];
      if (newGenres.includes(genre)) {
        return { ...prev, genre: newGenres.filter((item) => item !== genre) };
      } else {
        return { ...prev, genre: [...newGenres, genre] };
      }
    });

  const handlePriceRangeChange = (min, max) =>
    setActiveFilters((prev) => ({ ...prev, priceRange: { min, max } }));

  const toggleSection = (section) =>
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const handleProductClick = (productId) => router.push(`/details?id=${productId}`);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const clearAllFilters = () =>
    setActiveFilters({
      size: null,
      availability: [],
      category: [],
      color: [],
      priceRange: { min: 0, max: 1000 },
      genre: [],
      rating: null,
    }) && setSearchTerm("");

  const hasActiveFilters = () =>
    activeFilters.size !== null ||
    activeFilters.availability.length > 0 ||
    activeFilters.category.length > 0 ||
    activeFilters.color.length > 0 ||
    activeFilters.genre.length > 0 ||
    activeFilters.priceRange.min > 0 ||
    activeFilters.priceRange.max < 1000 ||
    searchTerm !== "";

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Chargement...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorMessage>Erreur: {error}</ErrorMessage>
        <RetryButton onClick={() => window.location.reload()}>Réessayer</RetryButton>
      </ErrorContainer>
    );
  }

  return (
    <PageContainer>
      <MainContent>
        <BreadcrumbContainer>
          <BreadcrumbLink href="/">Home</BreadcrumbLink> / Products
        </BreadcrumbContainer>

        <PageTitle>PRODUCTS</PageTitle>

        {hasActiveFilters() && (
          <ActiveFiltersBar>
            <ActiveFiltersTitle>Filtres actifs:</ActiveFiltersTitle>
            <ActiveFiltersList>
              {activeFilters.size && (
                <ActiveFilterTag>
                  Taille: {activeFilters.size}
                  <FilterTagRemove onClick={() => handleSizeClick(activeFilters.size)}>
                    <X size={14} />
                  </FilterTagRemove>
                </ActiveFilterTag>
              )}
              {activeFilters.category.map((cat) => (
                <ActiveFilterTag key={cat}>
                  Catégorie: {cat}
                  <FilterTagRemove onClick={() => handleCategoryClick(cat)}>
                    <X size={14} />
                  </FilterTagRemove>
                </ActiveFilterTag>
              ))}
              {activeFilters.color.map((color) => (
                <ActiveFilterTag key={color}>
                  Couleur: {color}
                  <FilterTagRemove onClick={() => handleColorClick(color)}>
                    <X size={14} />
                  </FilterTagRemove>
                </ActiveFilterTag>
              ))}
              {activeFilters.genre.map((genre) => (
                <ActiveFilterTag key={genre}>
                  Genre: {genre}
                  <FilterTagRemove onClick={() => handleGenreClick(genre)}>
                    <X size={14} />
                  </FilterTagRemove>
                </ActiveFilterTag>
              ))}
              {searchTerm && (
                <ActiveFilterTag>
                  Recherche: {searchTerm}
                  <FilterTagRemove onClick={() => setSearchTerm("")}>
                    <X size={14} />
                  </FilterTagRemove>
                </ActiveFilterTag>
              )}
            </ActiveFiltersList>
            <ClearFiltersButton onClick={clearAllFilters}>Effacer tous les filtres</ClearFiltersButton>
          </ActiveFiltersBar>
        )}

        <ContentWrapper>
          <Sidebar>
            <SidebarTitle>Filters</SidebarTitle>

            <FilterSection>
              <FilterTitle>Size</FilterTitle>
              <SizeGrid>
                {availableSizes.map((size) => (
                  <SizeButton key={size} active={activeFilters.size === size} onClick={() => handleSizeClick(size)}>
                    {size}
                  </SizeButton>
                ))}
              </SizeGrid>
            </FilterSection>

            <FilterAccordion>
              <FilterHeader onClick={() => toggleSection("availability")}>
                <FilterTitle>Availability</FilterTitle>
                <ExpandIcon>{expandedSections.availability ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</ExpandIcon>
              </FilterHeader>
              {expandedSections.availability && (
                <CheckboxGroup>
                  <CheckboxItem>
                    <Checkbox
                      type="checkbox"
                      id="availability"
                      checked={activeFilters.availability.includes("availability")}
                      onChange={() => handleAvailabilityClick("availability")}
                    />
                    <CheckboxLabel htmlFor="availability">Availability</CheckboxLabel>
                    <Count>({products.filter((p) => p.stock > 0).length})</Count>
                  </CheckboxItem>
                  <CheckboxItem>
                    <Checkbox
                      type="checkbox"
                      id="outOfStock"
                      checked={activeFilters.availability.includes("outOfStock")}
                      onChange={() => handleAvailabilityClick("outOfStock")}
                    />
                    <CheckboxLabel htmlFor="outOfStock">Out Of Stock</CheckboxLabel>
                    <Count>({products.filter((p) => !p.stock || p.stock === 0).length})</Count>
                  </CheckboxItem>
                </CheckboxGroup>
              )}
            </FilterAccordion>

            <FilterAccordion>
              <FilterHeader onClick={() => toggleSection("category")}>
                <FilterTitle>Category</FilterTitle>
                <ExpandIcon>{expandedSections.category ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</ExpandIcon>
              </FilterHeader>
              {expandedSections.category && (
                <CheckboxGroup>
                  {availableCategories.map((category) => (
                    <CheckboxItem key={category}>
                      <Checkbox
                        type="checkbox"
                        id={`category-${category}`}
                        checked={activeFilters.category.includes(category)}
                        onChange={() => handleCategoryClick(category)}
                      />
                      <CheckboxLabel htmlFor={`category-${category}`}>{category}</CheckboxLabel>
                      <Count>({products.filter((p) => p.category === category).length})</Count>
                    </CheckboxItem>
                  ))}
                </CheckboxGroup>
              )}
            </FilterAccordion>

            <FilterAccordion>
              <FilterHeader onClick={() => toggleSection("color")}>
                <FilterTitle>Colors</FilterTitle>
                <ExpandIcon>{expandedSections.color ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</ExpandIcon>
              </FilterHeader>
              {expandedSections.color && (
                <CheckboxGroup>
                  {availableColors.map((color) => (
                    <CheckboxItem key={color}>
                      <Checkbox
                        type="checkbox"
                        id={`color-${color}`}
                        checked={activeFilters.color.includes(color)}
                        onChange={() => handleColorClick(color)}
                      />
                      <CheckboxLabel htmlFor={`color-${color}`}>
                        <ColorSwatch color={color.toLowerCase()} />
                        {color}
                      </CheckboxLabel>
                      <Count>({products.filter((p) => p.color === color).length})</Count>
                    </CheckboxItem>
                  ))}
                </CheckboxGroup>
              )}
            </FilterAccordion>

            <FilterAccordion>
              <FilterHeader onClick={() => toggleSection("priceRange")}>
                <FilterTitle>Price Range</FilterTitle>
                <ExpandIcon>{expandedSections.priceRange ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</ExpandIcon>
              </FilterHeader>
              {expandedSections.priceRange && (
                <PriceRangeContainer>
                  <PriceInputs>
                    <PriceInput
                      type="number"
                      min="0"
                      max={activeFilters.priceRange.max}
                      value={activeFilters.priceRange.min}
                      onChange={(e) =>
                        handlePriceRangeChange(Number.parseInt(e.target.value), activeFilters.priceRange.max)
                      }
                      placeholder="Min"
                    />
                    <PriceRangeSeparator>-</PriceRangeSeparator>
                    <PriceInput
                      type="number"
                      min={activeFilters.priceRange.min}
                      value={activeFilters.priceRange.max}
                      onChange={(e) =>
                        handlePriceRangeChange(activeFilters.priceRange.min, Number.parseInt(e.target.value))
                      }
                      placeholder="Max"
                    />
                  </PriceInputs>
                  <PriceRangeSlider>
                    <PriceRangeTrack>
                      <PriceRangeFill
                        style={{
                          left: `${(activeFilters.priceRange.min / 1000) * 100}%`,
                          width: `${((activeFilters.priceRange.max - activeFilters.priceRange.min) / 1000) * 100}%`,
                        }}
                      />
                    </PriceRangeTrack>
                  </PriceRangeSlider>
                </PriceRangeContainer>
              )}
            </FilterAccordion>

            <FilterAccordion>
              <FilterHeader onClick={() => toggleSection("genre")}>
                <FilterTitle>Genre</FilterTitle>
                <ExpandIcon>{expandedSections.genre ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</ExpandIcon>
              </FilterHeader>
              {expandedSections.genre && (
                <CheckboxGroup>
                  {availableGenres.map((genre) => (
                    <CheckboxItem key={genre}>
                      <Checkbox
                        type="checkbox"
                        id={`genre-${genre}`}
                        checked={activeFilters.genre.includes(genre)}
                        onChange={() => handleGenreClick(genre)}
                      />
                      <CheckboxLabel htmlFor={`genre-${genre}`}>{genre}</CheckboxLabel>
                      <Count>({products.filter((p) => p.genre === genre).length})</Count>
                    </CheckboxItem>
                  ))}
                </CheckboxGroup>
              )}
            </FilterAccordion>

            <FilterAccordion>
              <FilterHeader onClick={() => toggleSection("ratings")}>
                <FilterTitle>Ratings</FilterTitle>
                <ExpandIcon>{expandedSections.ratings ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</ExpandIcon>
              </FilterHeader>
            </FilterAccordion>
          </Sidebar>

          <ProductsContainer>
            <SearchContainer>
              <SearchIcon>
                <Search size={20} />
              </SearchIcon>
              <SearchInput type="text" placeholder="Search" value={searchTerm} onChange={handleSearchChange} />
              {searchTerm && (
                <ClearSearchButton onClick={() => setSearchTerm("")}>
                  <X size={16} />
                </ClearSearchButton>
              )}
            </SearchContainer>

            <CategoryTabsContainer>
              <CategoryRow>
                <CategoryTab active={true}>NEW</CategoryTab>
                <CategoryTab>SHIRTS</CategoryTab>
                <CategoryTab>POLO SHIRTS</CategoryTab>
                <CategoryTab>SHORTS</CategoryTab>
                <CategoryTab>SUNGLASSES</CategoryTab>
              </CategoryRow>
              <CategoryRow>
                <CategoryTab>BEST SELLERS</CategoryTab>
                <CategoryTab>T-SHIRTS</CategoryTab>
                <CategoryTab>JEANS</CategoryTab>
                <CategoryTab>JACKETS</CategoryTab>
                <CategoryTab>COATS</CategoryTab>
              </CategoryRow>
            </CategoryTabsContainer>

            <ResultsCount>
              {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""} trouvé
              {filteredProducts.length !== 1 ? "s" : ""}
            </ResultsCount>

            {filteredProducts.length > 0 ? (
              <ProductGrid>
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} onClick={() => handleProductClick(product._id)}>
                    <ProductImageContainer>
                      <ProductImage
                        src={product.image || "/placeholder.svg?height=400&width=300"}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </ProductImageContainer>
                    <ProductInfo>
                      <ProductCategory>{product.category}</ProductCategory>
                      <ProductName>{product.name}</ProductName>
                      <ProductPrice>$ {product.price}</ProductPrice>
                    </ProductInfo>
                  </ProductCard>
                ))}
              </ProductGrid>
            ) : (
              <NoResultsContainer>
                <NoResultsMessage>Aucun produit ne correspond à vos critères de recherche.</NoResultsMessage>
                <RetryButton onClick={clearAllFilters}>Effacer les filtres</RetryButton>
              </NoResultsContainer>
            )}
          </ProductsContainer>
        </ContentWrapper>
      </MainContent>
    </PageContainer>
  );
}