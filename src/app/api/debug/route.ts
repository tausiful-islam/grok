import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Debug API route called')
    
    // Test the products API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const apiUrl = `${baseUrl}/api/products`
    
    console.log('Fetching from:', apiUrl)
    
    const response = await fetch(apiUrl)
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      return NextResponse.json({
        error: 'Failed to fetch products',
        status: response.status,
        statusText: response.statusText
      }, { status: 500 })
    }
    
    const data = await response.json()
    console.log('Products data:', JSON.stringify(data, null, 2))
    
    return NextResponse.json({
      success: true,
      apiUrl,
      data,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'
      }
    })
    
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({
      error: 'Debug API failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
