import AddProductForm from "./components/AddProductForm"
import Dashboard from "./components/Dashboard"

export default function Home() {
  return (
    <main>
      <Dashboard>
        <AddProductForm />
      </Dashboard>
    </main>
  )
}

