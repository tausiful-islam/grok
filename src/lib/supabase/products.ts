import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']

export interface ProductWithCategory {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  salePrice: number | null
  stockQuantity: number
  sku: string | null
  isActive: boolean
  isFeatured: boolean
  category: {
    id: string
    name: string
    slug: string
  } | null
  images: {
    id: string
    url: string
    alt_text: string
    is_primary: boolean
  }[]
  createdAt: string
  updatedAt: string
}

export interface CategoryData {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  isActive: boolean
  sortOrder: number
  seoTitle: string | null
  seoDescription: string | null
  createdAt: string
  updatedAt: string
}

export async function getProducts(params?: {
  page?: number
  limit?: number
  category?: string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  activeOnly?: boolean
}): Promise<{ products: ProductWithCategory[]; total: number }> {
  const supabase = createClient()

  // Set defaults
  const page = params?.page || 1
  const limit = params?.limit || 12
  const sortBy = params?.sortBy || 'created_at'
  const sortOrder = params?.sortOrder || 'desc'
  const activeOnly = params?.activeOnly !== false

  let query = supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `, { count: 'exact' })

  // Apply filters
  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  if (params?.category) {
    query = query.eq('category_id', params.category)
  }

  if (params?.search) {
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
  const transformedProducts: ProductWithCategory[] = (products as any[] || []).map((product: any) => ({
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
    category: product.categories ? {
      id: product.categories.id,
      name: product.categories.name,
      slug: product.categories.slug
    } : null,
    images: product.images?.map((url: string, index: number) => ({
      id: `${product.id}-image-${index}`,
      url,
      alt_text: product.name,
      is_primary: index === 0
    })) || [],
    createdAt: product.created_at,
    updatedAt: product.updated_at
  }))

  return {
    products: transformedProducts,
    total: count || 0
  }
}

export async function getFeaturedProducts(limit = 8): Promise<ProductWithCategory[]> {
  const { products } = await getProducts({
    limit,
    sortBy: 'created_at',
    sortOrder: 'desc',
    activeOnly: true
  })

  // Filter for featured products
  return products.filter(product => product.isFeatured)
}

export async function getProductById(id: string): Promise<ProductWithCategory | null> {
  const supabase = createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching product:', error)
    throw new Error('Failed to fetch product')
  }

  if (!product) return null

  // Transform the data
  const productData = product as any
  return {
    id: productData.id,
    name: productData.name,
    slug: productData.slug,
    description: productData.description,
    price: productData.base_price,
    salePrice: productData.sale_price,
    stockQuantity: productData.stock_quantity,
    sku: productData.sku,
    isActive: productData.is_active,
    isFeatured: productData.is_featured,
    category: productData.categories ? {
      id: productData.categories.id,
      name: productData.categories.name,
      slug: productData.categories.slug
    } : null,
    images: productData.images?.map((url: string, index: number) => ({
      id: `${productData.id}-image-${index}`,
      url,
      alt_text: productData.name,
      is_primary: index === 0
    })) || [],
    createdAt: productData.created_at,
    updatedAt: productData.updated_at
  }
}

export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  const supabase = createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching product:', error)
    throw new Error('Failed to fetch product')
  }

  if (!product) return null

  // Transform the data
  const productData = product as any
  return {
    id: productData.id,
    name: productData.name,
    slug: productData.slug,
    description: productData.description,
    price: productData.base_price,
    salePrice: productData.sale_price,
    stockQuantity: productData.stock_quantity,
    sku: productData.sku,
    isActive: productData.is_active,
    isFeatured: productData.is_featured,
    category: productData.categories ? {
      id: productData.categories.id,
      name: productData.categories.name,
      slug: productData.categories.slug
    } : null,
    images: productData.images?.map((url: string, index: number) => ({
      id: `${productData.id}-image-${index}`,
      url,
      alt_text: productData.name,
      is_primary: index === 0
    })) || [],
    createdAt: productData.created_at,
    updatedAt: productData.updated_at
  }
}

export async function getCategories(activeOnly = true): Promise<CategoryData[]> {
  const supabase = createClient()

  let query = supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data: categories, error } = await query

  if (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }

  // Transform the data
  return (categories as Category[] || []).map(category => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: category.image_url,
    isActive: category.is_active,
    sortOrder: category.sort_order,
    seoTitle: category.seo_title,
    seoDescription: category.seo_description,
    createdAt: category.created_at,
    updatedAt: category.updated_at
  }))
}

export async function getCategoryBySlug(slug: string): Promise<CategoryData | null> {
  const supabase = createClient()

  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching category:', error)
    throw new Error('Failed to fetch category')
  }

  if (!category) return null

  // Transform the data
  const categoryData = category as any
  return {
    id: categoryData.id,
    name: categoryData.name,
    slug: categoryData.slug,
    description: categoryData.description,
    imageUrl: categoryData.image_url,
    isActive: categoryData.is_active,
    sortOrder: categoryData.sort_order,
    seoTitle: categoryData.seo_title,
    seoDescription: categoryData.seo_description,
    createdAt: categoryData.created_at,
    updatedAt: categoryData.updated_at
  }
}
