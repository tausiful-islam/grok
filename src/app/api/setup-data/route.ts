import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create client with anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: NextRequest) {
  try {
    console.log('API: Starting to add categories and products...')

    // Categories data
    const categories = [
      {
        name: 'Gardening',
        slug: 'gardening',
        description: 'Everything you need for your garden - from seeds to tools',
        is_active: true,
        sort_order: 1,
        image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
        seo_title: 'Gardening Supplies & Tools',
        seo_description: 'Shop premium gardening supplies, tools, plants, and seeds for your garden.'
      },
      {
        name: 'Gifts',
        slug: 'gifts',
        description: 'Perfect gifts for every occasion and everyone',
        is_active: true,
        sort_order: 2,
        image_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500',
        seo_title: 'Gifts for Every Occasion',
        seo_description: 'Find the perfect gift for birthdays, holidays, and special occasions.'
      },
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest technology and electronic devices',
        is_active: true,
        sort_order: 3,
        image_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
        seo_title: 'Electronics & Technology',
        seo_description: 'Shop the latest electronics, gadgets, and technology products.'
      },
      {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing and fashion accessories',
        is_active: true,
        sort_order: 4,
        image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
        seo_title: 'Fashion & Clothing',
        seo_description: 'Discover the latest fashion trends and clothing for men and women.'
      }
    ]

    // Try to insert categories
    console.log('API: Inserting categories...')
    const { data: insertedCategories, error: categoriesError } = await supabase
      .from('categories')
      .upsert(categories, { onConflict: 'slug' })
      .select()

    if (categoriesError) {
      console.error('API: Categories error:', categoriesError)
      return NextResponse.json(
        { error: 'Failed to insert categories', details: categoriesError },
        { status: 400 }
      )
    }

    console.log('API: Categories inserted successfully')

    // Sample products data (shortened for API call)
    const products = [
      {
        name: 'Premium Garden Tool Set',
        slug: 'premium-garden-tool-set',
        description: 'Complete 5-piece garden tool set with ergonomic handles.',
        short_description: 'Complete 5-piece garden tool set with ergonomic handles',
        base_price: 89.99,
        sale_price: 69.99,
        cost_price: 35.00,
        category_id: insertedCategories.find(c => c.slug === 'gardening')?.id,
        brand: 'GreenThumb Pro',
        sku: 'GTP-TOOLSET-001',
        weight: 2.5,
        images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'],
        tags: ['gardening', 'tools', 'premium', 'ergonomic'],
        features: ['Ergonomic handles', 'Rust-resistant coating', '5-piece set'],
        is_active: true,
        is_featured: true,
        has_variants: true,
        stock_quantity: 60
      },
      {
        name: 'Wireless Bluetooth Headphones Pro',
        slug: 'wireless-bluetooth-headphones-pro',
        description: 'Premium wireless headphones with active noise cancellation.',
        short_description: 'Premium wireless headphones with noise cancellation',
        base_price: 299.99,
        sale_price: 249.99,
        cost_price: 120.00,
        category_id: insertedCategories.find(c => c.slug === 'electronics')?.id,
        brand: 'AudioMax',
        sku: 'AM-HEADPHONES-001',
        weight: 0.8,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
        tags: ['wireless', 'bluetooth', 'headphones', 'noise-cancellation'],
        features: ['Active noise cancellation', '30-hour battery', 'Quick charge'],
        is_active: true,
        is_featured: true,
        has_variants: true,
        stock_quantity: 100
      }
    ]

    console.log('API: Inserting products...')
    const { data: insertedProducts, error: productsError } = await supabase
      .from('products')
      .upsert(products, { onConflict: 'slug' })
      .select()

    if (productsError) {
      console.error('API: Products error:', productsError)
      return NextResponse.json(
        { error: 'Failed to insert products', details: productsError },
        { status: 400 }
      )
    }

    console.log('API: Products inserted successfully')

    return NextResponse.json({
      success: true,
      message: 'Categories and products added successfully',
      categories: insertedCategories.length,
      products: insertedProducts.length
    })

  } catch (error: any) {
    console.error('API: Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}