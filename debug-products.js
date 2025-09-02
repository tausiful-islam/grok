// Debug script to test Supabase connection and products API
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Environment variables:')
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 'Set' : 'Missing')

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

async function testConnection() {
  try {
    console.log('\n=== Testing Supabase Connection ===')
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test basic connection
    console.log('Testing basic connection...')
    const { data: healthCheck, error: healthError } = await supabase
      .from('products')
      .select('id')
      .limit(1)
    
    if (healthError) {
      console.error('Health check failed:', healthError)
      return
    }
    
    console.log('✅ Connection successful')
    
    // Test products query
    console.log('\nTesting products query...')
    const { data: products, error: productsError } = await supabase
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
      .limit(10)
    
    if (productsError) {
      console.error('❌ Products query failed:', productsError)
      return
    }
    
    console.log(`✅ Found ${products?.length || 0} products`)
    
    if (products && products.length > 0) {
      console.log('\nSample products:')
      products.slice(0, 3).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - $${product.base_price}`)
      })
    } else {
      console.log('⚠️  No products found')
    }
    
    // Test RLS policies
    console.log('\nTesting RLS policies...')
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('id, name, is_active')
    
    if (allError) {
      console.error('❌ RLS test failed:', allError)
    } else {
      console.log(`✅ RLS allows access to ${allProducts?.length || 0} products`)
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

testConnection()
