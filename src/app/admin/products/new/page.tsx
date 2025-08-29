import { Metadata } from 'next'
import { ProductForm } from '../components/product-form'

export const metadata: Metadata = {
  title: 'Add New Product - Admin',
  description: 'Create a new product',
}

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600">Create a new product for your store</p>
      </div>

      <ProductForm />
    </div>
  )
}
