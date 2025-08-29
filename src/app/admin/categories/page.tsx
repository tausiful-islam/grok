import { Metadata } from 'next'
import { AdminCategoriesTable } from './components/admin-categories-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Categories - Admin',
  description: 'Manage product categories',
}

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage product categories and organization</p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>

      <AdminCategoriesTable />
    </div>
  )
}
