import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

// Mock data for development when Supabase is not configured
const mockCategories = [
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and tech accessories',
    image_url: '/images/placeholder-product.svg',
    is_active: true,
    sort_order: 1,
    seo_title: 'Electronics - Latest Gadgets and Tech',
    seo_description: 'Discover the latest electronics and tech accessories',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'clothing',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion for every occasion',
    image_url: '/images/placeholder-product.svg',
    is_active: true,
    sort_order: 2,
    seo_title: 'Clothing - Fashion for Every Occasion',
    seo_description: 'Explore our wide range of clothing and fashion items',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'home',
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Everything for your home',
    image_url: '/images/placeholder-product.svg',
    is_active: true,
    sort_order: 3,
    seo_title: 'Home & Garden - Everything for Your Home',
    seo_description: 'Find everything you need for your home and garden',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'sports',
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    description: 'Gear up for your active lifestyle',
    image_url: '/images/placeholder-product.svg',
    is_active: true,
    sort_order: 4,
    seo_title: 'Sports & Fitness - Gear Up for Your Active Lifestyle',
    seo_description: 'Get the best sports and fitness equipment',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

type Category = Database['public']['Tables']['categories']['Row']

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url') {
      // Return mock data for development
      const { searchParams } = new URL(request.url)
      const includeInactive = searchParams.get('includeInactive') === 'true'

      let categories = mockCategories
      if (!includeInactive) {
        categories = categories.filter(cat => cat.is_active)
      }

      // Transform the data to match our expected format
      const transformedCategories = categories.map(category => ({
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

      return NextResponse.json({
        categories: transformedCategories
      })
    }

    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const includeInactive = searchParams.get('includeInactive') === 'true'

    let query = supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    // Only show active categories by default
    if (!includeInactive) {
      query = query.eq('is_active', true)
    }

    const { data: categories, error } = await query

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      )
    }

    // Transform the data to match our expected format
    const transformedCategories = (categories as Category[] | null)?.map(category => ({
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
    })) || []

    return NextResponse.json({
      categories: transformedCategories
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
    const supabase = createClient()

    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userProfile || (userProfile as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      name,
      slug,
      description,
      imageUrl,
      isActive = true,
      sortOrder = 0,
      seoTitle,
      seoDescription
    } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        name,
        slug,
        description,
        image_url: imageUrl,
        is_active: isActive,
        sort_order: sortOrder,
        seo_title: seoTitle,
        seo_description: seoDescription
      } as any)
      .select()
      .single()

    if (error) {
      console.error('Error creating category:', error)
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      )
    }

    return NextResponse.json(category, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
