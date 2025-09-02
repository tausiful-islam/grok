import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Debug API route called')
    
    // Test direct Supabase connection
    console.log('Testing direct Supabase connection...')
    
    const supabase = createClient()
    
    const { data: products, error } = await supabase
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
      .limit(5)
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({
        error: 'Supabase query failed',
        details: error
      }, { status: 500 })
    }
    
    console.log('Products found:', products?.length || 0)
    
    return NextResponse.json({
      success: true,
      productsCount: products?.length || 0,
      products: products || [],
      env: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
      }
    })
    
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({
      error: 'Debug API failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
