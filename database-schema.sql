-- E-commerce Platform Database Schema
-- Supabase PostgreSQL Setup

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Custom types
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'super_admin');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE variant_type AS ENUM ('color', 'size', 'version', 'material', 'style');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name text NOT NULL,
  role user_role DEFAULT 'customer',
  phone text,
  address jsonb,
  avatar_url text,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories table with hierarchy support
CREATE TABLE categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  parent_id uuid REFERENCES categories(id),
  image_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  seo_title text,
  seo_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table with advanced features
CREATE TABLE products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_description text,
  base_price decimal(12,2) NOT NULL CHECK (base_price >= 0),
  sale_price decimal(12,2) CHECK (sale_price >= 0 AND sale_price < base_price),
  cost_price decimal(12,2) CHECK (cost_price >= 0),
  category_id uuid REFERENCES categories(id),
  brand text,
  sku text UNIQUE,
  barcode text,
  weight decimal(8,2),
  dimensions jsonb, -- {length, width, height}
  images text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  features text[] DEFAULT '{}',
  specifications jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  has_variants boolean DEFAULT false,
  stock_quantity integer DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold integer DEFAULT 5,
  track_inventory boolean DEFAULT true,
  allow_backorders boolean DEFAULT false,
  seo_title text,
  seo_description text,
  seo_keywords text[],
  views_count integer DEFAULT 0,
  sales_count integer DEFAULT 0,
  rating_average decimal(3,2) DEFAULT 0 CHECK (rating_average >= 0 AND rating_average <= 5),
  rating_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Indexes for performance
  CONSTRAINT valid_sale_price CHECK (sale_price IS NULL OR sale_price < base_price)
);

-- Product variants with comprehensive options
CREATE TABLE product_variants (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  variant_type variant_type NOT NULL,
  variant_name text NOT NULL,
  variant_value text NOT NULL, -- 'Red', 'XL', 'Pro Version'
  price_adjustment decimal(10,2) DEFAULT 0,
  cost_price_adjustment decimal(10,2) DEFAULT 0,
  stock_quantity integer DEFAULT 0 CHECK (stock_quantity >= 0),
  sku_suffix text,
  image_url text,
  hex_color text, -- For color variants
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(product_id, variant_type, variant_value)
);

-- Orders with comprehensive tracking
CREATE TABLE orders (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES profiles(id),
  guest_email text,
  guest_name text,
  guest_phone text,
  subtotal decimal(12,2) NOT NULL CHECK (subtotal >= 0),
  tax_amount decimal(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
  shipping_amount decimal(10,2) DEFAULT 0 CHECK (shipping_amount >= 0),
  discount_amount decimal(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
  total_amount decimal(12,2) NOT NULL CHECK (total_amount >= 0),
  status order_status DEFAULT 'pending',
  payment_method text DEFAULT 'cod',
  payment_status text DEFAULT 'pending',
  currency text DEFAULT 'BDT',
  shipping_address jsonb NOT NULL,
  billing_address jsonb,
  shipping_method text,
  tracking_number text,
  notes text,
  admin_notes text,
  cancelled_reason text,
  cancelled_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Constraint to ensure guest or user info
  CONSTRAINT order_customer_check CHECK (
    (user_id IS NOT NULL) OR
    (guest_email IS NOT NULL AND guest_name IS NOT NULL)
  )
);

-- Order items with variant support
CREATE TABLE order_items (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  variant_id uuid REFERENCES product_variants(id),
  product_name text NOT NULL, -- Snapshot for order history
  variant_details jsonb, -- Snapshot of variant info
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price decimal(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price decimal(10,2) NOT NULL CHECK (total_price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Shopping cart with session support
CREATE TABLE cart_items (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  session_id text,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Ensure cart belongs to user or session
  CONSTRAINT cart_owner_check CHECK (
    (user_id IS NOT NULL) OR (session_id IS NOT NULL)
  ),

  -- Prevent duplicate items
  UNIQUE(user_id, session_id, product_id, variant_id)
);

-- Wishlists
CREATE TABLE wishlists (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),

  UNIQUE(user_id, product_id)
);

-- Product reviews
CREATE TABLE product_reviews (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  guest_name text,
  guest_email text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  content text,
  is_verified_purchase boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),

  CONSTRAINT review_author_check CHECK (
    (user_id IS NOT NULL) OR
    (guest_name IS NOT NULL AND guest_email IS NOT NULL)
  )
);

-- Coupons and discounts
CREATE TABLE coupons (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value decimal(10,2) NOT NULL CHECK (discount_value > 0),
  minimum_order_amount decimal(10,2) DEFAULT 0,
  max_discount_amount decimal(10,2),
  usage_limit integer,
  used_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Analytics and tracking tables
CREATE TABLE page_views (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_type text NOT NULL,
  page_id uuid, -- product_id, category_id, etc.
  user_id uuid REFERENCES profiles(id),
  session_id text,
  ip_address inet,
  user_agent text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE search_analytics (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  search_term text NOT NULL,
  results_count integer DEFAULT 0,
  user_id uuid REFERENCES profiles(id),
  session_id text,
  created_at timestamptz DEFAULT now()
);

-- Inventory tracking
CREATE TABLE inventory_movements (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id uuid REFERENCES products(id),
  variant_id uuid REFERENCES product_variants(id),
  movement_type text NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),
  quantity integer NOT NULL,
  reason text,
  reference_id uuid, -- order_id or other reference
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Performance indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_search ON products USING gin(name gin_trgm_ops, description gin_trgm_ops);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(created_at DESC);
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_cart_session ON cart_items(session_id);
CREATE INDEX idx_variants_product ON product_variants(product_id);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Policies for products (public read, admin write)
CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- Policies for orders (users see own orders, admins see all)
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- Policies for cart (users manage own cart)
CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL USING (user_id = auth.uid());

-- Functions for order number generation
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
BEGIN
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
         LPAD((SELECT COALESCE(MAX(RIGHT(order_number, 4))::integer, 0) + 1
               FROM orders
               WHERE order_number LIKE 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-%')::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_variants_updated_at BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
