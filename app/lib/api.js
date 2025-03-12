// API_URL - Assurez-vous que cette variable est définie dans vos variables d'environnement (ex: .env)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Function to fetch products with a limit
export async function fetchProducts(limit = 6) {
  try {
    const response = await fetch(`https://fakestoreapi.com/products?limit=${limit}`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Function to create a new product
export const createProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token"); // Get auth token if you have one stored

    if (!token) {
      throw new Error("Non autorisé. Veuillez vous connecter.");
    }

    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Assuming you're sending JSON data
      },
      body: JSON.stringify(productData), // Ensure productData is converted to JSON
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Une erreur est survenue");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Function to get all products
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des produits");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};


export async function fetchProduct(params = {}) {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams()

    // Add all filter parameters that are defined
    if (params.search) queryParams.append("search", params.search)
    if (params.category) queryParams.append("category", params.category)
    if (params.genre) queryParams.append("genre", params.genre)
    if (params.size) queryParams.append("size", params.size)
    if (params.color) queryParams.append("color", params.color)
    if (params.sort) queryParams.append("sort", params.sort)
    if (params.page) queryParams.append("page", params.page.toString())
    if (params.limit) queryParams.append("limit", params.limit.toString())

    // Make the API request
    const response = await fetch(`http://localhost:5000/api/products?${queryParams.toString()}`)

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()

    return {
      products: data,
      totalProducts: data.length,
      hasMore: data.length === params.limit,
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    return {
      products: [],
      totalProducts: 0,
      hasMore: false,
    }
  }
}



// Fonctions utilitaires pour gérer l'authentification

// Récupérer le token d'authentification
export const getAuthToken = () => {
  return sessionStorage.getItem("token")
}

// Récupérer les données utilisateur
export const getUserData = () => {
  const userData = sessionStorage.getItem("user")
  return userData ? JSON.parse(userData) : null
}

// Vérifier si l'utilisateur est connecté
export const isAuthenticated = () => {
  return !!getAuthToken()
}

// Déconnexion
export const logout = () => {
  sessionStorage.removeItem("token")
  sessionStorage.removeItem("user")
}

// Fonction pour ajouter le token d'authentification aux en-têtes des requêtes
export const authHeader = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

