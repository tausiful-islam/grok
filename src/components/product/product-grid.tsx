import { ProductCard } from '@/components/product/product-card'
import { productsApi } from '@/lib/api/client'

interface ProductGridProps {
  params: {
    category?: string
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    page?: number
    limit?: number
  }
}

export async function ProductGrid({ params }: ProductGridProps) {
  try {
    const response = await productsApi.getAll(params)

    if (response.data.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search terms
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {response.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination would go here */}
        {response.pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="text-sm text-muted-foreground">
              Page {response.pagination.page} of {response.pagination.totalPages}
            </div>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error loading products:', error)

    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Error loading products</h3>
        <p className="text-muted-foreground">
          Please try again later
        </p>
      </div>
    )
  }
}
