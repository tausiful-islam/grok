import { Metadata } from 'next'
import { CategoriesGrid } from './components/categories-grid'

export const metadata: Metadata = {
  title: 'Categories - E-Shop',
  description: 'Browse our product categories',
}

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="text-muted-foreground">
          Explore our wide range of product categories
        </p>
      </div>

      <CategoriesGrid />
    </div>
  )
}
