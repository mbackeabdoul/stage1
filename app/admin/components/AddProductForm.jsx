"use client"

import { useState } from "react"
import styled from "styled-components"
import { FaSave, FaTimes, FaCloudUploadAlt } from "react-icons/fa"
import axios from "axios"

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
`

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #2d3748;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 10px;
`

const FormGroup = styled.div`
  margin-bottom: 20px;
`

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #4a5568;
`

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    border-color: #3182ce;
    outline: none;
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 120px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #3182ce;
    outline: none;
  }
`

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.3s;

  &:focus {
    border-color: #3182ce;
    outline: none;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
`

const SaveButton = styled(Button)`
  background-color: #48bb78;
  color: white;
  border: none;

  &:hover {
    background-color: #38a169;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`

const CancelButton = styled(Button)`
  background-color: white;
  color: #4a5568;
  border: 1px solid #e2e8f0;

  &:hover {
    background-color: #f7fafc;
  }
`

const FileInputContainer = styled.div`
  position: relative;
  margin-top: 10px;
`

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 2px dashed #e2e8f0;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #3182ce;
    color: #3182ce;
  }
`

const HiddenFileInput = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const PreviewImage = styled.div`
  width: 100%;
  height: 200px;
  margin-top: 10px;
  border-radius: 4px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid #e2e8f0;
`

const ErrorMessage = styled.div`
  color: #e53e3e;
  margin-top: 5px;
  font-size: 0.875rem;
`

const SuccessMessage = styled.div`
  color: #38a169;
  margin-top: 16px;
  padding: 10px;
  background-color: #f0fff4;
  border-radius: 4px;
  border-left: 4px solid #38a169;
  font-weight: 500;
`

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    genre: "",
    size: "",
    color: "",
    description: "",
    image: null,
  })

  const [preview, setPreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null

    if (file) {
      // Preview the image
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)

      setFormData({ ...formData, image: file })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "",
      genre: "",
      size: "",
      color: "",
      description: "",
      image: null,
    })
    setPreview("")
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Validate required fields
      if (!formData.name || !formData.price || !formData.category || !formData.description) {
        throw new Error("Veuillez remplir tous les champs obligatoires.")
      }

      // Format the data for the API
      const productData = new FormData()
      productData.append("name", formData.name)
      productData.append("price", formData.price)
      productData.append("category", formData.category)
      productData.append("genre", formData.genre)
      productData.append("description", formData.description)

      if (formData.size) {
        productData.append("size", formData.size)
      }

      if (formData.color) {
        productData.append("color", formData.color)
      }

      if (formData.image) {
        productData.append("image", formData.image)
      }

      // Get the token from localStorage
      const token = localStorage.getItem("token")
      // Remove quotes if the token is stored with them
      const cleanToken = token ? token.replace(/^"|"$/g, "") : null

      // Send the request with the proper headers
      const response = await axios.post("https://projets1-back-3.onrender.com/api/products", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${cleanToken}`,
        },
      })

      setSuccess(true)
      resetForm()
    } catch (err) {
      console.error("Error adding product:", err)
      setError(err.response?.data?.message || err.message || "Une erreur est survenue lors de l'ajout du produit")
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormContainer>
      <FormTitle>Ajouter un nouveau produit</FormTitle>

      <form onSubmit={handleSubmit}>
        <FormRow>
          <FormGroup>
            <Label htmlFor="name">Nom du produit *</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Entrez le nom du produit"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="price">Prix *</Label>
            <Input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Entrez le prix"
              min="0"
              step="0.01"
              required
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label htmlFor="category">Catégorie *</Label>
            <Select id="category" name="category" value={formData.category} onChange={handleInputChange} required>
              <option value="">Sélectionnez une catégorie</option>
              <option value="vêtements">Vêtements</option>
              <option value="chaussures">Chaussures</option>
              <option value="accessoires">Accessoires</option>
              <option value="électronique">Électronique</option>
              <option value="maison">Maison</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="size">Taille (si applicable)</Label>
            <Input
              type="text"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              placeholder="S, M, L, XL, etc."
            />
          </FormGroup>
        </FormRow>
        <FormRow>
        <FormGroup>
          <Label htmlFor="color">Couleur (si applicable)</Label>
          <Input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            placeholder="Rouge, Bleu, Noir, etc."
          />
        </FormGroup>

        <FormGroup>
            <Label htmlFor="genre">Genre *</Label>
            <Select id="genre" name="genre" value={formData.genre} onChange={handleInputChange} required>
              <option value="">Sélectionnez une catégorie</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
              <option value="Kids">kids</option>
            
            </Select>
          </FormGroup>
          </FormRow>

        <FormGroup>
          <Label htmlFor="description">Description *</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Décrivez le produit en détail"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Image du produit</Label>
          <FileInputContainer>
            <FileInputLabel htmlFor="image">
              <FaCloudUploadAlt size={24} />
              {formData.image ? formData.image.name : "Cliquez pour ajouter une image"}
            </FileInputLabel>
            <HiddenFileInput type="file" id="image" accept="image/*" onChange={handleFileChange} />
          </FileInputContainer>

          {preview && <PreviewImage style={{ backgroundImage: `url(${preview})` }} />}
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>Le produit a été ajouté avec succès!</SuccessMessage>}

        <ButtonGroup>
          <SaveButton type="submit" disabled={loading}>
            <FaSave />
            {loading ? "Chargement..." : "Enregistrer"}
          </SaveButton>
          <CancelButton type="button" onClick={resetForm}>
            <FaTimes />
            Annuler
          </CancelButton>
        </ButtonGroup>
      </form>
    </FormContainer>
  )
}

export default AddProductForm

