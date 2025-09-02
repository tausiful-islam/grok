import { ProductCard } from '@/components/product/product-card'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']

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
    const supabase = createClient()
    
    // Parse parameters with defaults
    const page = params.page || 1
    const limit = params.limit || 12
    const sortBy = params.sortBy || 'created_at'
    const sortOrder = params.sortOrder || 'desc'

    let query = supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('is_active', true)

    // Apply filters
    if (params.category) {
      query = query.eq('category_id', params.category)
    }

    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%, description.ilike.%${params.search}%`)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: products, error, count } = await query

    if (error) {
      console.error('Error fetching products:', error)
      throw new Error('Failed to fetch products')
    }

    // Transform the data to match our expected format
    const transformedProducts = (products as (Product & { categories: Category | null })[] | null)?.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.base_price,
      salePrice: product.sale_price,
      stockQuantity: product.stock_quantity,
      sku: product.sku,
      isActive: product.is_active,
      isFeatured: product.is_featured,
      category: product.categories,
      images: product.images?.map((url: string, index: number) => ({
        id: `${product.id}-image-${index}`,
        url,
        alt_text: product.name,
        is_primary: index === 0
      })) || [],
      createdAt: product.created_at,
      updatedAt: product.updated_at
    })) || []

    if (transformedProducts.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search terms
          </p>
        </div>
      )
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {transformedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages} ({count} products total)
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
