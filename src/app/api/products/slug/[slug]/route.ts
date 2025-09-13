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

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url') {
      // Return mock data for development
      const mockProduct = mockProducts.find(p => p.slug === slug)
      
      if (!mockProduct) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }

      const transformedProduct = {
        id: mockProduct.id,
        name: mockProduct.name,
        slug: mockProduct.slug,
        description: mockProduct.description,
        price: mockProduct.base_price,
        salePrice: mockProduct.sale_price,
        stockQuantity: mockProduct.stock_quantity,
        sku: mockProduct.sku,
        isActive: mockProduct.is_active,
        isFeatured: mockProduct.is_featured,
        category: null, // Mock category
        images: mockProduct.images?.map((url, index) => ({
          id: `${mockProduct.id}-image-${index}`,
          url,
          alt_text: mockProduct.name,
          is_primary: index === 0
        })) || [],
        createdAt: mockProduct.created_at,
        updatedAt: mockProduct.updated_at
      }

      return NextResponse.json({
        product: transformedProduct
      })
    }

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
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching product:', error)
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: 500 }
      )
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Transform the data to match our expected format
    const productData = product as Product & { categories: Category | null }
    const transformedProduct = {
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
      category: productData.categories,
      images: productData.images?.map((url: string, index: number) => ({
        id: `${productData.id}-image-${index}`,
        url,
        alt_text: productData.name,
        is_primary: index === 0
      })) || [],
      createdAt: productData.created_at,
      updatedAt: productData.updated_at
    }

    return NextResponse.json({
      product: transformedProduct
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}