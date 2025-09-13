# Product Addition Guide

This guide explains how to add products to your e-commerce platform. The system supports two types of products:

1. **Simple Products** - No color/size variants (single price, single add-to-cart)
2. **Variable Products** - With color/size variants (multiple options, price variations)

## Table of Contents

- [Quick Start](#quick-start)
- [Simple Products](#simple-products)
- [Variable Products (with Variants)](#variable-products-with-variants)
- [Method 1: Supabase Dashboard](#method-1-supabase-dashboard)
- [Method 2: Script-Based Addition](#method-2-script-based-addition)
- [Product Schema Reference](#product-schema-reference)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Method 1: Supabase Dashboard (Recommended)
1. Go to your Supabase Dashboard → Table Editor
2. Select the `products` table
3. Click "Insert" → "Insert row"
4. Fill in the product details
5. Save the row

### Method 2: Script-Based Addition
Create a Node.js script to insert products programmatically using the Supabase client.

---

## Simple Products

Simple products are the easiest to add. They have:
- Single price
- No color/size options
- Direct add-to-cart functionality

### Required Fields for Simple Products:
```javascript
{
  name: "Product Name",                    // Required
  slug: "product-name",                   // Required (URL-friendly)
  base_price: 29.99,                      // Required
  description: "Product description",      // Optional but recommended
  category_id: "category-uuid",           // Optional
  has_variants: false,                    // Required: false for simple products
  stock_quantity: 100,                    // Optional (default: 0)
  is_active: true,                        // Optional (default: true)
  images: ["image1.jpg", "image2.jpg"]    // Optional
}
```

### Simple Product Example:
```javascript
const simpleProduct = {
  name: "Wireless Gaming Mouse",
  slug: "wireless-gaming-mouse",
  base_price: 59.99,
  description: "High-precision wireless gaming mouse with RGB lighting",
  has_variants: false,
  stock_quantity: 50,
  is_active: true,
  images: ["mouse1.jpg", "mouse2.jpg"]
};
```

---

## Variable Products (with Variants)

Variable products offer multiple options like colors, sizes, or versions with different prices.

### Required Fields for Variable Products:
```javascript
{
  name: "Product Name",                    // Required
  slug: "product-name",                   // Required
  base_price: 29.99,                      // Required (base/starting price)
  description: "Product description",      // Optional
  category_id: "category-uuid",           // Optional
  has_variants: true,                     // Required: true for variable products
  stock_quantity: 0,                      // Not used (variants have their own stock)
  is_active: true,                        // Optional
  images: ["image1.jpg"]                  // Base product images
}
```

### Product Variants:
After creating the variable product, add variants to the `product_variants` table:

```javascript
const productVariants = [
  {
    product_id: "product-uuid",
    variant_type: "color",
    variant_name: "Color",
    variant_value: "Red",
    price_adjustment: 0,              // Add/subtract from base_price
    stock_quantity: 25,
    hex_color: "#FF0000",            // For color variants
    sort_order: 1
  },
  {
    product_id: "product-uuid",
    variant_type: "color", 
    variant_name: "Color",
    variant_value: "Blue",
    price_adjustment: 5.00,          // $5 more than base price
    stock_quantity: 30,
    hex_color: "#0000FF",
    sort_order: 2
  }
];
```

---

## Method 1: Supabase Dashboard

### Step 1: Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to "Table Editor" in the sidebar
3. Select the `products` table

### Step 2: Add New Product
1. Click the "Insert" button → "Insert row"
2. Fill in the required fields:
   - `name`: Product name
   - `slug`: URL-friendly name (e.g., "wireless-mouse")
   - `base_price`: Price as decimal (e.g., 29.99)
   - `has_variants`: false for simple products, true for variable products

### Step 3: Optional Fields
- `description`: Product description
- `category_id`: Select from categories table
- `stock_quantity`: Available stock (for simple products)
- `images`: Array of image URLs
- `is_active`: true to make product visible

### Step 4: Save Product
Click "Save" to insert the product into the database.

### For Variable Products:
After creating the main product, add variants to the `product_variants` table:
1. Go to the `product_variants` table
2. Insert rows for each variant (color, size, etc.)
3. Link to the main product using `product_id`

---

## Method 2: Script-Based Addition

Create a Node.js script to add products programmatically. We've included a complete example script.

### Option A: Use the Example Script
1. **Copy the example script**: `add-products-example.js` (included in your project)
2. **Install dependencies** (if not already installed):
   ```bash
   npm install @supabase/supabase-js dotenv
   ```
3. **Run the script**:
   ```bash
   node add-products-example.js
   ```

This will add 2 simple products and 1 variable product with 6 size variants.

### Option B: Create Your Own Script

### Option B: Create Your Own Script

### Step 1: Create Product Addition Script
```javascript
// add-products.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function addSimpleProduct() {
  const product = {
    name: 'Wireless Gaming Mouse',
    slug: 'wireless-gaming-mouse',
    base_price: 59.99,
    description: 'High-precision wireless gaming mouse with RGB lighting',
    has_variants: false,
    stock_quantity: 50,
    is_active: true,
    images: ['https://example.com/mouse1.jpg']
  };

  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Product added:', data[0].name);
  }
}

addSimpleProduct();
```

### Step 2: Run the Script
```bash
cd "/home/tausif/grok _x/ecommerce-platform"
node add-products.js
```

### Step 3: Variable Products Script
```javascript
async function addVariableProduct() {
  // 1. First, add the main product
  const product = {
    name: 'Premium T-Shirt',
    slug: 'premium-t-shirt',
    base_price: 24.99,
    description: 'High-quality cotton t-shirt',
    has_variants: true,
    is_active: true
  };

  const { data: productData, error: productError } = await supabase
    .from('products')
    .insert([product])
    .select();

  if (productError) {
    console.error('Product Error:', productError);
    return;
  }

  const productId = productData[0].id;

  // 2. Add variants
  const variants = [
    {
      product_id: productId,
      variant_type: 'size',
      variant_name: 'Size',
      variant_value: 'Small',
      price_adjustment: -2.00,
      stock_quantity: 25
    },
    {
      product_id: productId,
      variant_type: 'size',
      variant_name: 'Size',
      variant_value: 'Medium',
      price_adjustment: 0,
      stock_quantity: 50
    },
    {
      product_id: productId,
      variant_type: 'size',
      variant_name: 'Size',
      variant_value: 'Large',
      price_adjustment: 3.00,
      stock_quantity: 30
    }
  ];

  const { data: variantData, error: variantError } = await supabase
    .from('product_variants')
    .insert(variants)
    .select();

  if (variantError) {
    console.error('Variants Error:', variantError);
  } else {
    console.log('Variable product created with', variantData.length, 'variants');
  }
}
```

---

## Using the Admin Panel

### Step 1: Access Admin Panel
Navigate to: `http://localhost:3002/admin/products`

### Step 2: Add New Product
1. Click "Add New Product" button
2. Fill in basic information:
   - Product Name
   - Description
   - Base Price
   - Category (optional)
   - Images

### Step 3: Choose Product Type
**For Simple Products:**
- Uncheck "Has Variants"
- Set stock quantity
- Save product

**For Variable Products:**
- Check "Has Variants" 
- Save product first
- Then add variants (colors, sizes, etc.)

### Step 4: Manage Variants (Variable Products Only)
1. After saving the product, click "Manage Variants"
2. Add each variant:
   - Type (color, size, version)
   - Value (Red, Large, Pro)
   - Price adjustment (+/- from base price)
   - Stock quantity
   - Additional options (hex color for colors)

---

## Advanced: SQL Direct Method

If you prefer to use SQL directly in the Supabase SQL Editor:

### For Simple Products:
```sql
INSERT INTO products (
  name, slug, base_price, description, has_variants, stock_quantity, is_active
) VALUES (
  'Wireless Mouse',
  'wireless-mouse', 
  49.99,
  'Ergonomic wireless mouse',
  false,
  100,
  true
);
```

### For Variable Products:
```sql
-- 1. Insert the main product
INSERT INTO products (
  name, slug, base_price, description, has_variants, is_active
) VALUES (
  'Premium T-Shirt',
  'premium-t-shirt',
  19.99,
  'High-quality cotton t-shirt',
  true,
  true
);

-- 2. Insert variants
INSERT INTO product_variants (
  product_id, variant_type, variant_name, variant_value, 
  price_adjustment, stock_quantity, sort_order
) VALUES 
  ('product-uuid', 'size', 'Size', 'Small', 0, 50, 1),
  ('product-uuid', 'size', 'Size', 'Medium', 0, 75, 2),
  ('product-uuid', 'size', 'Size', 'Large', 2.00, 60, 3);
```

---

## Product Schema Reference

### Products Table:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Product name |
| `slug` | string | ✅ | URL-friendly name |
| `base_price` | number | ✅ | Base/starting price |
| `description` | text | ❌ | Product description |
| `has_variants` | boolean | ✅ | true for variable, false for simple |
| `stock_quantity` | number | ❌ | Stock (simple products only) |
| `category_id` | uuid | ❌ | Product category |
| `images` | array | ❌ | Product image URLs |
| `is_active` | boolean | ❌ | Product visibility |
| `is_featured` | boolean | ❌ | Featured on homepage |

### Product Variants Table:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_id` | uuid | ✅ | Parent product ID |
| `variant_type` | string | ✅ | color, size, version, etc. |
| `variant_name` | string | ✅ | Display name (Color, Size) |
| `variant_value` | string | ✅ | Actual value (Red, Large) |
| `price_adjustment` | number | ❌ | Price difference from base |
| `stock_quantity` | number | ❌ | Stock for this variant |
| `hex_color` | string | ❌ | Color code (for color variants) |
| `sort_order` | number | ❌ | Display order |

---

## Examples

### Example 1: Simple Electronic Product
```javascript
const wirelessMouse = {
  name: "Wireless Gaming Mouse",
  slug: "wireless-gaming-mouse",
  base_price: 79.99,
  description: "High-precision wireless gaming mouse with customizable RGB lighting and ergonomic design. Perfect for gaming and productivity.",
  short_description: "High-precision wireless gaming mouse with RGB lighting",
  category_id: "electronics-category-id",
  has_variants: false,
  stock_quantity: 150,
  is_active: true,
  is_featured: true,
  images: [
    "https://example.com/mouse-main.jpg",
    "https://example.com/mouse-side.jpg"
  ],
  features: [
    "2.4GHz wireless connectivity",
    "RGB lighting with multiple modes",
    "Ergonomic design",
    "6 programmable buttons"
  ],
  specifications: {
    "DPI": "up to 12,000",
    "Battery Life": "40 hours",
    "Weight": "95g",
    "Dimensions": "126 x 68 x 42mm"
  }
};
```

### Example 2: Variable Clothing Product
```javascript
// 1. Main product
const tshirt = {
  name: "Premium Cotton T-Shirt",
  slug: "premium-cotton-tshirt",
  base_price: 24.99,
  description: "Ultra-soft 100% organic cotton t-shirt with modern fit.",
  has_variants: true,
  is_active: true,
  images: ["tshirt-main.jpg"]
};

// 2. Size variants
const sizeVariants = [
  {
    variant_type: "size",
    variant_name: "Size",
    variant_value: "XS",
    price_adjustment: -2.00,
    stock_quantity: 20,
    sort_order: 1
  },
  {
    variant_type: "size", 
    variant_name: "Size",
    variant_value: "S",
    price_adjustment: 0,
    stock_quantity: 50,
    sort_order: 2
  },
  {
    variant_type: "size",
    variant_name: "Size", 
    variant_value: "M",
    price_adjustment: 0,
    stock_quantity: 75,
    sort_order: 3
  },
  {
    variant_type: "size",
    variant_name: "Size",
    variant_value: "L", 
    price_adjustment: 0,
    stock_quantity: 60,
    sort_order: 4
  },
  {
    variant_type: "size",
    variant_name: "Size",
    variant_value: "XL",
    price_adjustment: 3.00,
    stock_quantity: 40,
    sort_order: 5
  }
];

// 3. Color variants
const colorVariants = [
  {
    variant_type: "color",
    variant_name: "Color",
    variant_value: "White",
    price_adjustment: 0,
    stock_quantity: 100,
    hex_color: "#FFFFFF",
    sort_order: 1
  },
  {
    variant_type: "color",
    variant_name: "Color", 
    variant_value: "Black",
    price_adjustment: 0,
    stock_quantity: 120,
    hex_color: "#000000",
    sort_order: 2
  },
  {
    variant_type: "color",
    variant_name: "Color",
    variant_value: "Navy Blue",
    price_adjustment: 2.00,
    stock_quantity: 80,
    hex_color: "#001F3F",
    sort_order: 3
  }
];
```

---

## Troubleshooting

### Common Issues:

**1. Slug Already Exists**
- Error: Duplicate slug
- Solution: Use unique slugs (e.g., "wireless-mouse-v2")

**2. Missing Category**
- Error: Category not found
- Solution: Create category first or use `null` for category_id

**3. Variant Issues**
- Error: Variants without parent product
- Solution: Create main product first, then add variants

**4. Stock Problems**
- Simple products: Set `stock_quantity` on main product
- Variable products: Set `stock_quantity` on each variant

**5. Images Not Showing**
- Ensure image URLs are accessible
- Use absolute URLs or proper relative paths
- Check image permissions

### Best Practices:

1. **Always test products** after adding them
2. **Use descriptive slugs** for better SEO
3. **Add high-quality images** for better conversion
4. **Set appropriate stock levels** to avoid overselling
5. **Use categories** to organize products
6. **Write detailed descriptions** for better customer experience

---

## Quick Reference

### Simple Product Checklist:
- [ ] Product name and slug
- [ ] Base price set
- [ ] `has_variants: false`
- [ ] Stock quantity set (for Supabase dashboard method)
- [ ] At least one image (optional)
- [ ] Category assigned (optional)
- [ ] Product is active

### Variable Product Checklist:
- [ ] Product name and slug  
- [ ] Base price set
- [ ] `has_variants: true`
- [ ] All variants created (in product_variants table)
- [ ] Each variant has stock
- [ ] Price adjustments set
- [ ] Variant sort order set
- [ ] Product is active

---

For technical support or advanced customization, refer to the project documentation or contact the development team.