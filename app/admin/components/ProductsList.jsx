"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { FaEdit, FaTrash, FaEye } from "react-icons/fa"
import { getProducts } from "../../lib/api"

const ProductsContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`

const ProductsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 10px;
`

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d3748;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background-color: #f7fafc;
  color: #4a5568;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
`

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
`

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #4a5568;
  margin-right: 8px;
  transition: color 0.3s;

  &:hover {
    color: #3182ce;
  }
`

const DeleteButton = styled(ActionButton)`
  &:hover {
    color: #e53e3e;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #718096;
`

const LoadingState = styled.div`
  text-align: center;
  padding: 40px;
  color: #718096;
`

const ProductsList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (err) {
        setError(err.message || "Une erreur est survenue lors de la récupération des produits")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <ProductsContainer>
        <ProductsHeader>
          <Title>Liste des produits</Title>
        </ProductsHeader>
        <LoadingState>Chargement des produits...</LoadingState>
      </ProductsContainer>
    )
  }

  if (error) {
    return (
      <ProductsContainer>
        <ProductsHeader>
          <Title>Liste des produits</Title>
        </ProductsHeader>
        <EmptyState>Erreur: {error}</EmptyState>
      </ProductsContainer>
    )
  }

  if (products.length === 0) {
    return (
      <ProductsContainer>
        <ProductsHeader>
          <Title>Liste des produits</Title>
        </ProductsHeader>
        <EmptyState>Aucun produit trouvé.</EmptyState>
      </ProductsContainer>
    )
  }

  return (
    <ProductsContainer>
      <ProductsHeader>
        <Title>Liste des produits</Title>
      </ProductsHeader>

      <Table>
        <thead>
          <tr>
            <Th>Image</Th>
            <Th>Nom</Th>
            <Th>Prix</Th>
            <Th>Catégorie</Th>
            <Th>Taille</Th>
            <Th>Couleur</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <Td>
                {product.image ? (
                  <ProductImage src={product.image} alt={product.name} />
                ) : (
                  <ProductImage src="/placeholder.svg?height=50&width=50" alt="Placeholder" />
                )}
              </Td>
              <Td>{product.name}</Td>
              <Td>{product.price.toLocaleString()} €</Td>
              <Td>{product.category}</Td>
              <Td>{product.size || "-"}</Td>
              <Td>{product.color || "-"}</Td>
              <Td>
                <ActionButton title="Voir">
                  <FaEye />
                </ActionButton>
                <ActionButton title="Modifier">
                  <FaEdit />
                </ActionButton>
                <DeleteButton title="Supprimer">
                  <FaTrash />
                </DeleteButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </ProductsContainer>
  )
}

export default ProductsList

