// Script to update featured products in the database
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

async function updateFeaturedProducts() {
  try {
    console.log('Updating featured products...')
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Update products to make them featured
    const { data, error } = await supabase
      .from('products')
      .update({ is_featured: true })
      .in('slug', ['wireless-headphones', 'cotton-t-shirt', 'garden-hose'])
      .select()
    
    if (error) {
      console.error('❌ Error updating products:', error)
      return
    }
    
    console.log('✅ Updated products:', data)
    
    // Verify the update
    const { data: allProducts, error: fetchError } = await supabase
      .from('products')
      .select('id, name, slug, is_featured, is_active')
    
    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError)
      return
    }
    
    console.log('\nAll products:')
    allProducts.forEach(product => {
      console.log(`- ${product.name} (${product.slug}): featured=${product.is_featured}, active=${product.is_active}`)
    })
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

updateFeaturedProducts()
