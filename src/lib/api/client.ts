// API client utilities for the e-commerce application

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')

export interface Product {
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
  category: Category | null
  images: ProductImage[]
  createdAt: string
  updatedAt: string
}

export interface Category {
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

export interface ProductImage {
  id: string
  url: string
  alt_text: string
  is_primary: boolean
}

export interface ApiResponse<T> {
  data: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Products API
export const productsApi = {
  async getAll(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<Product>> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.category) searchParams.set('category', params.category)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder)

    const response = await fetch(`${API_BASE_URL}/api/products?${searchParams}`)
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }

    const data = await response.json()
    return {
      data: data.products,
      pagination: data.pagination
    }
  },

  async getFeatured(): Promise<Product[]> {
    const response = await this.getAll({
      limit: 8,
      sortBy: 'created_at',
      sortOrder: 'desc'
    })
    return response.data.filter(product => product.isFeatured)
  },

  async getById(id: string): Promise<Product | null> {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`)
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Failed to fetch product')
    }

    const data = await response.json()
    return data.product
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const response = await fetch(`${API_BASE_URL}/api/products/slug/${slug}`)
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Failed to fetch product')
    }

    const data = await response.json()
    return data.product
  }
}

// Categories API
export const categoriesApi = {
  async getAll(includeInactive = false): Promise<Category[]> {
    const searchParams = new URLSearchParams()
    if (includeInactive) {
      searchParams.set('includeInactive', 'true')
    }

    const response = await fetch(`${API_BASE_URL}/api/categories?${searchParams}`)
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }

    const data = await response.json()
    return data.categories
  },

  async getById(id: string): Promise<Category | null> {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`)
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Failed to fetch category')
    }

    const data = await response.json()
    return data.category
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const response = await fetch(`${API_BASE_URL}/api/categories/slug/${slug}`)
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Failed to fetch category')
    }

    const data = await response.json()
    return data.category
  }
}

// Generic API error handler
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}
