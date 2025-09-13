#!/usr/bin/env node

/**
 * Product Addition Script
 * 
 * This script helps you add products to your e-commerce platform.
 * 
 * Usage:
 * 1. Make sure you have Node.js installed
 * 2. Copy this file to your project root
 * 3. Install dependencies: npm install @supabase/supabase-js dotenv
 * 4. Modify the products array below
 * 5. Run: node add-products-example.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Example products to add
const simpleProducts = [
  {
    name: 'Wireless Bluetooth Speaker',
    slug: 'wireless-bluetooth-speaker',
    base_price: 79.99,
    description: 'Portable wireless speaker with excellent sound quality and 12-hour battery life.',
    short_description: 'Portable wireless speaker with excellent sound quality',
    has_variants: false,
    stock_quantity: 45,
    is_active: true,
    is_featured: false,
    images: [
      'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=500&h=500&fit=crop'
    ],
    features: [
      'Bluetooth 5.0 connectivity',
      '12-hour battery life',
      'Waterproof design',
      'Built-in microphone'
    ],
    specifications: {
      "Battery Life": "12 hours",
      "Connectivity": "Bluetooth 5.0",
      "Weight": "580g",
      "Dimensions": "180 x 65 x 65mm"
    }
  },
  {
    name: 'Ergonomic Office Chair',
    slug: 'ergonomic-office-chair',
    base_price: 299.99,
    description: 'Professional ergonomic office chair with lumbar support and adjustable height.',
    short_description: 'Professional ergonomic office chair with lumbar support',
    has_variants: false,
    stock_quantity: 20,
    is_active: true,
    is_featured: true,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop'
    ],
    features: [
      'Adjustable lumbar support',
      'Height adjustable',
      'Breathable mesh back',
      '360-degree swivel'
    ],
    specifications: {
      "Material": "Mesh and foam",
      "Weight Capacity": "150kg",
      "Seat Height": "42-52cm adjustable",
      "Warranty": "5 years"
    }
  }
];

// Example variable product (with size variants)
const variableProduct = {
  name: 'Premium Hoodie',
  slug: 'premium-hoodie',
  base_price: 49.99,
  description: 'Ultra-soft premium hoodie made from organic cotton blend. Perfect for casual wear.',
  short_description: 'Ultra-soft premium hoodie made from organic cotton',
  has_variants: true,
  is_active: true,
  is_featured: true,
  images: [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop'
  ],
  features: [
    '80% organic cotton, 20% recycled polyester',
    'Machine washable',
    'Relaxed fit',
    'Kangaroo pocket'
  ],
  specifications: {
    "Material": "80% Organic Cotton, 20% Recycled Polyester",
    "Care": "Machine wash cold",
    "Fit": "Relaxed",
    "Origin": "Ethically sourced"
  }
};

// Variants for the hoodie
const hoodieVariants = [
  {
    variant_type: 'size',
    variant_name: 'Size',
    variant_value: 'XS',
    price_adjustment: -5.00,
    stock_quantity: 15,
    sort_order: 1
  },
  {
    variant_type: 'size',
    variant_name: 'Size',
    variant_value: 'S',
    price_adjustment: 0,
    stock_quantity: 30,
    sort_order: 2
  },
  {
    variant_type: 'size',
    variant_name: 'Size',
    variant_value: 'M',
    price_adjustment: 0,
    stock_quantity: 35,
    sort_order: 3
  },
  {
    variant_type: 'size',
    variant_name: 'Size',
    variant_value: 'L',
    price_adjustment: 0,
    stock_quantity: 30,
    sort_order: 4
  },
  {
    variant_type: 'size',
    variant_name: 'Size',
    variant_value: 'XL',
    price_adjustment: 5.00,
    stock_quantity: 25,
    sort_order: 5
  },
  {
    variant_type: 'size',
    variant_name: 'Size',
    variant_value: 'XXL',
    price_adjustment: 10.00,
    stock_quantity: 15,
    sort_order: 6
  }
];

/**
 * Add simple products (no variants)
 */
async function addSimpleProducts() {
  console.log('🔄 Adding simple products...');
  
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(simpleProducts)
      .select('name, slug');

    if (error) {
      console.error('❌ Error adding simple products:', error);
      return false;
    }

    console.log('✅ Successfully added simple products:');
    data.forEach(product => {
      console.log(`   - ${product.name} (${product.slug})`);
    });
    
    return true;
  } catch (err) {
    console.error('❌ Failed to add simple products:', err);
    return false;
  }
}

/**
 * Add variable product with variants
 */
async function addVariableProduct() {
  console.log('🔄 Adding variable product...');
  
  try {
    // 1. Add the main product
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert([variableProduct])
      .select('id, name, slug');

    if (productError) {
      console.error('❌ Error adding variable product:', productError);
      return false;
    }

    const productId = productData[0].id;
    console.log(`✅ Added product: ${productData[0].name}`);

    // 2. Add variants
    const variantsWithProductId = hoodieVariants.map(variant => ({
      ...variant,
      product_id: productId
    }));

    const { data: variantData, error: variantError } = await supabase
      .from('product_variants')
      .insert(variantsWithProductId)
      .select('variant_value, price_adjustment');

    if (variantError) {
      console.error('❌ Error adding variants:', variantError);
      return false;
    }

    console.log(`✅ Added ${variantData.length} variants:`);
    variantData.forEach(variant => {
      const price = variableProduct.base_price + variant.price_adjustment;
      console.log(`   - Size ${variant.variant_value}: $${price.toFixed(2)}`);
    });

    return true;
  } catch (err) {
    console.error('❌ Failed to add variable product:', err);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting product addition process...\n');

  // Check Supabase connection
  const { data, error } = await supabase.from('products').select('count');
  if (error) {
    console.error('❌ Cannot connect to Supabase:', error);
    console.log('Please check your environment variables in .env.local');
    process.exit(1);
  }
  console.log('✅ Connected to Supabase\n');

  // Add simple products
  const simpleSuccess = await addSimpleProducts();
  console.log('');

  // Add variable product
  const variableSuccess = await addVariableProduct();
  console.log('');

  // Summary
  if (simpleSuccess && variableSuccess) {
    console.log('🎉 All products added successfully!');
    console.log('You can now view them on your website.');
  } else {
    console.log('⚠️  Some products failed to add. Check the errors above.');
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { addSimpleProducts, addVariableProduct };