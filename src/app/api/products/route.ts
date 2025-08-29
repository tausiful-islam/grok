import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

// Mock data for development when Supabase is not configured
const mockProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    base_price: 199.99,
    sale_price: 149.99,
    stock_quantity: 50,
    sku: 'WBH-001',
    is_active: true,
    is_featured: true,
    category_id: 'electronics',
    images: ['/images/placeholder-product.svg'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    slug: 'smart-fitness-watch',
    description: 'Track your fitness goals with this advanced smartwatch',
    base_price: 299.99,
    sale_price: null,
    stock_quantity: 30,
    sku: 'SFW-002',
    is_active: true,
    is_featured: true,
    category_id: 'electronics',
    images: ['/images/placeholder-product.svg'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Premium Coffee Maker',
    slug: 'premium-coffee-maker',
    description: 'Brew the perfect cup of coffee every morning',
    base_price: 149.99,
    sale_price: 119.99,
    stock_quantity: 25,
    sku: 'PCM-003',
    is_active: true,
    is_featured: true,
    category_id: 'home',
    images: ['/images/placeholder-product.svg'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    slug: 'ergonomic-office-chair',
    description: 'Comfortable chair for long work sessions',
    base_price: 399.99,
    sale_price: null,
    stock_quantity: 15,
    sku: 'EOC-004',
    is_active: true,
    is_featured: true,
    category_id: 'home',
    images: ['/images/placeholder-product.svg'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url') {
      // Return mock data for development
      const { searchParams } = new URL(request.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '12')
      const sortBy = searchParams.get('sortBy') || 'created_at'
      const sortOrder = searchParams.get('sortOrder') || 'desc'

      // Apply sorting
      let sortedProducts = [...mockProducts]
      if (sortBy === 'base_price') {
        sortedProducts.sort((a, b) => sortOrder === 'asc' ? a.base_price - b.base_price : b.base_price - a.base_price)
      }

      // Apply pagination
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedProducts = sortedProducts.slice(startIndex, endIndex)

      const transformedProducts = paginatedProducts.map(product => ({
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
        category: null, // Mock category
        images: product.images?.map((url, index) => ({
          id: `${product.id}-image-${index}`,
          url,
          alt_text: product.name,
          is_primary: index === 0
        })) || [],
        createdAt: product.created_at,
        updatedAt: product.updated_at
      }))

      return NextResponse.json({
        products: transformedProducts,
        pagination: {
          page,
          limit,
          total: mockProducts.length,
          totalPages: Math.ceil(mockProducts.length / limit)
        }
      })
    }

    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

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

    // Apply filters
    if (category) {
      query = query.eq('category_id', category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%, description.ilike.%${search}%`)
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
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    // Transform the data to match our expected format
    const transformedProducts = (products as Product[] | null)?.map(product => ({
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
      category: (product as any).categories as Category | null,
      images: product.images?.map((url: string, index: number) => ({
        id: `${product.id}-image-${index}`,
        url,
        alt_text: product.name,
        is_primary: index === 0
      })) || [],
      createdAt: product.created_at,
      updatedAt: product.updated_at
    })) || []

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      slug,
      description,
      short_description,
      base_price,
      sale_price,
      stock_quantity,
      sku,
      category_id,
      is_active = true,
      specifications = {},
      images = [],
      tags = [],
      features = []
    } = body

    // Validate required fields
    if (!name || !base_price) {
      return NextResponse.json(
        { error: 'Missing required fields: name and base_price are required' },
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url') {
      // Return mock success for development
      const mockProduct = {
        id: Date.now().toString(),
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        description,
        short_description,
        base_price,
        sale_price,
        stock_quantity: stock_quantity || 0,
        sku,
        category_id,
        is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      return NextResponse.json(mockProduct, { status: 201 })
    }

    const supabase = createClient()

    const productData = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      description,
      short_description,
      base_price,
      sale_price,
      stock_quantity: stock_quantity || 0,
      sku,
      category_id,
      is_active,
      specifications,
      images,
      tags,
      features,
      low_stock_threshold: 5,
      track_inventory: true,
      allow_backorders: false,
      has_variants: false,
      views_count: 0,
      sales_count: 0,
      rating_average: 0,
      rating_count: 0
    }

    const { data: product, error } = await (supabase as any)
      .from('products')
      .insert(productData)
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json(
        { error: 'Failed to create product: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(product, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
