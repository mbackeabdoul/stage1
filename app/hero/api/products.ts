// API service to fetch products
export interface Product {
    id: number
    title: string
    price: number
    image: string
    category: string
    description?: string
  }
  
  export async function fetchProducts(limit = 6): Promise<Product[]> {
    try {
      const response = await fetch(`https://fakestoreapi.com/products?limit=${limit}`)
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching products:", error)
      return []
    }
  }
  
  