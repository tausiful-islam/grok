import { Metadata } from 'next'
import { Suspense } from 'react'
import { ProductGrid } from '@/components/product/product-grid'
import { ProductFilters } from '@/components/product/product-filters'
import { ProductSort } from '@/components/product/product-sort'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { productsApi } from '@/lib/api/client'

export const metadata: Metadata = {
  title: 'Products - It\'s Your Choice',
  description: 'Browse our complete collection of products',
}

interface ProductsPageProps {
  searchParams: {
    category?: string
    search?: string
    sortBy?: string
    sortOrder?: string
    page?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = {
    category: searchParams.category,
    search: searchParams.search,
    sortBy: searchParams.sortBy || 'created_at',
    sortOrder: (searchParams.sortOrder === 'asc' ? 'asc' : 'desc') as 'desc' | 'asc',
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: 12
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Products</h1>
        <p className="text-muted-foreground">
          Discover our amazing collection of products
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <ProductFilters />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sort Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              Showing products
            </div>
            <ProductSort />
          </div>

          {/* Products Grid */}
          <Suspense fallback={<LoadingSpinner />}>
            <ProductGrid params={params} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
