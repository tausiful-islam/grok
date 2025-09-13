-- E-Commerce Platform Database Schema-- E-commerce Platform Database Schema

-- This file contains the complete database schema for your e-commerce platform-- Supabase PostgreSQL Setup

-- Execute this in your Supabase SQL Editor to recreate the database structure-- Enhanced for Full Admin Control



-- Enable necessary extensions-- Enable necessary extensions

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom typesCREATE EXTENSION IF NOT EXISTS "pg_cron";

CREATE TYPE user_role AS ENUM ('customer', 'admin', 'super_admin');

CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');-- Custom types

CREATE TYPE variant_type AS ENUM ('color', 'size', 'version', 'material', 'style');CREATE TYPE user_role AS ENUM ('customer', 'admin', 'super_admin');

CREATE TYPE notification_type AS ENUM ('order', 'inventory', 'system', 'payment');CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');

CREATE TYPE report_type AS ENUM ('sales', 'inventory', 'customers', 'products');CREATE TYPE variant_type AS ENUM ('color', 'size', 'version', 'material', 'style');

CREATE TYPE backup_status AS ENUM ('pending', 'running', 'completed', 'failed');CREATE TYPE notification_type AS ENUM ('order', 'inventory', 'system', 'payment');

CREATE TYPE report_type AS ENUM ('sales', 'inventory', 'customers', 'products');

-- User profiles tableCREATE TYPE backup_status AS ENUM ('pending', 'running', 'completed', 'failed');

CREATE TABLE profiles (

    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,-- Store Settings Table (moved before profiles to avoid dependency issues)

    name TEXT NOT NULL,CREATE TABLE store_settings (

    role user_role DEFAULT 'customer',  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

    phone TEXT,  setting_key text UNIQUE NOT NULL,

    address JSONB,  setting_value jsonb,

    avatar_url TEXT,  setting_type text DEFAULT 'string',

    is_active BOOLEAN DEFAULT true,  is_public boolean DEFAULT false,

    last_login TIMESTAMP WITH TIME ZONE,  description text,

    total_orders INTEGER DEFAULT 0,  updated_by uuid, -- Will add foreign key constraint later

    total_spent DECIMAL(10,2) DEFAULT 0,  created_at timestamptz DEFAULT now(),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,  updated_at timestamptz DEFAULT now()

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL);

);

-- Insert default store settings

-- Categories tableINSERT INTO store_settings (setting_key, setting_value, setting_type, is_public, description) VALUES

CREATE TABLE categories (('store_name', '"It\'s Your Choice"', 'string', true, 'Store name displayed throughout the site'),

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),('store_email', '"support@eshop.com"', 'string', true, 'Primary contact email'),

    name TEXT NOT NULL,('store_phone', '["+1 (555) 123-4567"]', 'array', true, 'Store phone numbers'),

    slug TEXT UNIQUE NOT NULL,('store_address', '{"street": "123 Commerce Street", "city": "Business District", "state": "NY", "zip": "10001", "country": "USA"}', 'object', true, 'Store physical address'),

    description TEXT,('currency', '"BDT"', 'string', true, 'Default currency code'),

    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,('timezone', '"UTC"', 'string', false, 'Store timezone'),

    image_url TEXT,('maintenance_mode', 'false', 'boolean', false, 'Enable maintenance mode'),

    is_active BOOLEAN DEFAULT true,('allow_guest_checkout', 'true', 'boolean', false, 'Allow guest checkout'),

    sort_order INTEGER DEFAULT 0,('min_order_amount', '0', 'number', false, 'Minimum order amount'),

    seo_title TEXT,('free_shipping_threshold', '50', 'number', true, 'Free shipping threshold'),

    seo_description TEXT,('tax_rate', '0', 'number', false, 'Default tax rate percentage'),

    product_count INTEGER DEFAULT 0,('default_weight_unit', '"kg"', 'string', false, 'Default weight unit'),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,('default_dimension_unit', '"cm"', 'string', false, 'Default dimension unit');

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL

);-- Profiles table (extends auth.users)

CREATE TABLE profiles (

-- Products table  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,

CREATE TABLE products (  name text NOT NULL,

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  email text NOT NULL, -- Adding email field for easier admin lookup

    name TEXT NOT NULL,  role user_role DEFAULT 'customer',

    slug TEXT UNIQUE NOT NULL,  phone text,

    description TEXT,  address jsonb,

    short_description TEXT,  avatar_url text,

    base_price DECIMAL(10,2) NOT NULL,  is_active boolean DEFAULT true,

    sale_price DECIMAL(10,2),  last_login timestamptz,

    cost_price DECIMAL(10,2),  total_orders integer DEFAULT 0,

    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,  total_spent decimal(12,2) DEFAULT 0,

    brand TEXT,  created_at timestamptz DEFAULT now(),

    sku TEXT,  updated_at timestamptz DEFAULT now()

    barcode TEXT,);

    weight DECIMAL(8,2),

    dimensions JSONB,-- Categories table with hierarchy support

    images TEXT[] DEFAULT '{}',CREATE TABLE categories (

    tags TEXT[] DEFAULT '{}',  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

    features TEXT[] DEFAULT '{}',  name text NOT NULL,

    specifications JSONB DEFAULT '{}',  slug text UNIQUE NOT NULL,

    is_active BOOLEAN DEFAULT true,  description text,

    is_featured BOOLEAN DEFAULT false,  parent_id uuid REFERENCES categories(id),

    has_variants BOOLEAN DEFAULT false,  image_url text,

    stock_quantity INTEGER DEFAULT 0,  is_active boolean DEFAULT true,

    low_stock_threshold INTEGER DEFAULT 10,  sort_order integer DEFAULT 0,

    track_inventory BOOLEAN DEFAULT true,  seo_title text,

    allow_backorders BOOLEAN DEFAULT false,  seo_description text,

    seo_title TEXT,  product_count integer DEFAULT 0,

    seo_description TEXT,  created_at timestamptz DEFAULT now(),

    seo_keywords TEXT[],  updated_at timestamptz DEFAULT now()

    views_count INTEGER DEFAULT 0,);

    sales_count INTEGER DEFAULT 0,

    rating_average DECIMAL(3,2) DEFAULT 0,-- Products table with advanced features

    rating_count INTEGER DEFAULT 0,CREATE TABLE products (

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL  name text NOT NULL,

);  slug text UNIQUE NOT NULL,

  description text,

-- Product variants table  short_description text,

CREATE TABLE product_variants (  base_price decimal(12,2) NOT NULL CHECK (base_price >= 0),

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  sale_price decimal(12,2) CHECK (sale_price >= 0 AND sale_price < base_price),

    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,  cost_price decimal(12,2) CHECK (cost_price >= 0),

    variant_type variant_type NOT NULL,  category_id uuid REFERENCES categories(id),

    variant_name TEXT NOT NULL,  brand text,

    variant_value TEXT NOT NULL,  sku text UNIQUE,

    price_adjustment DECIMAL(10,2) DEFAULT 0,  barcode text,

    cost_price_adjustment DECIMAL(10,2) DEFAULT 0,  weight decimal(8,2),

    stock_quantity INTEGER DEFAULT 0,  dimensions jsonb, -- {length, width, height}

    sku_suffix TEXT,  images text[] DEFAULT '{}',

    image_url TEXT,  tags text[] DEFAULT '{}',

    hex_color TEXT,  features text[] DEFAULT '{}',

    sort_order INTEGER DEFAULT 0,  specifications jsonb DEFAULT '{}',

    is_active BOOLEAN DEFAULT true,  is_active boolean DEFAULT true,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,  is_featured boolean DEFAULT false,

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL  has_variants boolean DEFAULT false,

);  stock_quantity integer DEFAULT 0 CHECK (stock_quantity >= 0),

  low_stock_threshold integer DEFAULT 5,

-- Cart items table  track_inventory boolean DEFAULT true,

CREATE TABLE cart_items (  allow_backorders boolean DEFAULT false,

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  seo_title text,

    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  seo_description text,

    session_id TEXT,  seo_keywords text[],

    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,  views_count integer DEFAULT 0,

    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,  sales_count integer DEFAULT 0,

    quantity INTEGER NOT NULL CHECK (quantity > 0),  rating_average decimal(3,2) DEFAULT 0 CHECK (rating_average >= 0 AND rating_average <= 5),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,  rating_count integer DEFAULT 0,

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL  created_at timestamptz DEFAULT now(),

);  updated_at timestamptz DEFAULT now(),



-- Orders table  -- Indexes for performance

CREATE TABLE orders (  CONSTRAINT valid_sale_price CHECK (sale_price IS NULL OR sale_price < base_price)

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),);

    order_number TEXT UNIQUE NOT NULL,

    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,-- Product variants with comprehensive options

    guest_email TEXT,CREATE TABLE product_variants (

    guest_name TEXT,  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

    guest_phone TEXT,  product_id uuid REFERENCES products(id) ON DELETE CASCADE,

    subtotal DECIMAL(10,2) NOT NULL,  variant_type variant_type NOT NULL,

    tax_amount DECIMAL(10,2) DEFAULT 0,  variant_name text NOT NULL,

    shipping_amount DECIMAL(10,2) DEFAULT 0,  variant_value text NOT NULL, -- 'Red', 'XL', 'Pro Version'

    discount_amount DECIMAL(10,2) DEFAULT 0,  price_adjustment decimal(10,2) DEFAULT 0,

    total_amount DECIMAL(10,2) NOT NULL,  cost_price_adjustment decimal(10,2) DEFAULT 0,

    status order_status DEFAULT 'pending',  stock_quantity integer DEFAULT 0 CHECK (stock_quantity >= 0),

    payment_method TEXT DEFAULT 'cash_on_delivery',  sku_suffix text,

    payment_status TEXT DEFAULT 'pending',  image_url text,

    currency TEXT DEFAULT 'USD',  hex_color text, -- For color variants

    shipping_address JSONB NOT NULL,  sort_order integer DEFAULT 0,

    billing_address JSONB,  is_active boolean DEFAULT true,

    shipping_method TEXT,  created_at timestamptz DEFAULT now(),

    tracking_number TEXT,  updated_at timestamptz DEFAULT now(),

    notes TEXT,

    admin_notes TEXT,  UNIQUE(product_id, variant_type, variant_value)

    cancelled_reason TEXT,);

    cancelled_at TIMESTAMP WITH TIME ZONE,

    shipped_at TIMESTAMP WITH TIME ZONE,-- Orders with comprehensive tracking

    delivered_at TIMESTAMP WITH TIME ZONE,CREATE TABLE orders (

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL  order_number text UNIQUE NOT NULL,

);  user_id uuid REFERENCES profiles(id),

  guest_email text,

-- Order items table  guest_name text,

CREATE TABLE order_items (  guest_phone text,

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  subtotal decimal(12,2) NOT NULL CHECK (subtotal >= 0),

    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,  tax_amount decimal(10,2) DEFAULT 0 CHECK (tax_amount >= 0),

    product_id UUID REFERENCES products(id) ON DELETE SET NULL,  shipping_amount decimal(10,2) DEFAULT 0 CHECK (shipping_amount >= 0),

    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,  discount_amount decimal(10,2) DEFAULT 0 CHECK (discount_amount >= 0),

    product_name TEXT NOT NULL,  total_amount decimal(12,2) NOT NULL CHECK (total_amount >= 0),

    variant_details JSONB,  status order_status DEFAULT 'pending',

    quantity INTEGER NOT NULL CHECK (quantity > 0),  payment_method text DEFAULT 'cod',

    unit_price DECIMAL(10,2) NOT NULL,  payment_status text DEFAULT 'pending',

    total_price DECIMAL(10,2) NOT NULL,  currency text DEFAULT 'BDT',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL  shipping_address jsonb NOT NULL,

);  billing_address jsonb,

  shipping_method text,

-- Product reviews table  tracking_number text,

CREATE TABLE product_reviews (  notes text,

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  admin_notes text,

    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,  cancelled_reason text,

    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,  cancelled_at timestamptz,

    guest_name TEXT,  shipped_at timestamptz,

    guest_email TEXT,  delivered_at timestamptz,

    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),  created_at timestamptz DEFAULT now(),

    title TEXT,  updated_at timestamptz DEFAULT now(),

    content TEXT,

    is_verified_purchase BOOLEAN DEFAULT false,  -- Constraint to ensure guest or user info

    is_approved BOOLEAN DEFAULT false,  CONSTRAINT order_customer_check CHECK (

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL    (user_id IS NOT NULL) OR

);    (guest_email IS NOT NULL AND guest_name IS NOT NULL)

  )

-- Wishlists table);

CREATE TABLE wishlists (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),-- Order items with variant support

    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,CREATE TABLE order_items (

    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,

    UNIQUE(user_id, product_id)  product_id uuid REFERENCES products(id),

);  variant_id uuid REFERENCES product_variants(id),

  product_name text NOT NULL, -- Snapshot for order history

-- Coupons table  variant_details jsonb, -- Snapshot of variant info

CREATE TABLE coupons (  quantity integer NOT NULL CHECK (quantity > 0),

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  unit_price decimal(10,2) NOT NULL CHECK (unit_price >= 0),

    code TEXT UNIQUE NOT NULL,  total_price decimal(10,2) NOT NULL CHECK (total_price >= 0),

    name TEXT NOT NULL,  created_at timestamptz DEFAULT now()

    description TEXT,);

    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),

    discount_value DECIMAL(10,2) NOT NULL,-- Shopping cart with session support

    minimum_order_amount DECIMAL(10,2) DEFAULT 0,CREATE TABLE cart_items (

    max_discount_amount DECIMAL(10,2),  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

    usage_limit INTEGER,  user_id uuid REFERENCES profiles(id),

    used_count INTEGER DEFAULT 0,  session_id text,

    is_active BOOLEAN DEFAULT true,  product_id uuid REFERENCES products(id) ON DELETE CASCADE,

    valid_from TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),  variant_id uuid REFERENCES product_variants(id) ON DELETE CASCADE,

    valid_until TIMESTAMP WITH TIME ZONE,  quantity integer NOT NULL CHECK (quantity > 0),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL  created_at timestamptz DEFAULT now(),

);  updated_at timestamptz DEFAULT now(),



-- Inventory movements table  -- Ensure cart belongs to user or session

CREATE TABLE inventory_movements (  CONSTRAINT cart_owner_check CHECK (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),    (user_id IS NOT NULL) OR (session_id IS NOT NULL)

    product_id UUID REFERENCES products(id) ON DELETE SET NULL,  ),

    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,

    movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),  -- Prevent duplicate items

    quantity INTEGER NOT NULL,  UNIQUE(user_id, session_id, product_id, variant_id)

    previous_stock INTEGER,);

    new_stock INTEGER,

    reason TEXT,-- Wishlists

    reference_id UUID,CREATE TABLE wishlists (

    reference_type TEXT,  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL  product_id uuid REFERENCES products(id) ON DELETE CASCADE,

);  created_at timestamptz DEFAULT now(),



-- Inventory alerts table  UNIQUE(user_id, product_id)

CREATE TABLE inventory_alerts ();

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    product_id UUID REFERENCES products(id) ON DELETE CASCADE,-- Product reviews

    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,CREATE TABLE product_reviews (

    alert_type TEXT NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock')),  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

    threshold INTEGER,  product_id uuid REFERENCES products(id) ON DELETE CASCADE,

    current_stock INTEGER,  user_id uuid REFERENCES profiles(id),

    is_resolved BOOLEAN DEFAULT false,  guest_name text,

    resolved_at TIMESTAMP WITH TIME ZONE,  guest_email text,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),

);  title text,

  content text,

-- Store settings table  is_verified_purchase boolean DEFAULT false,

CREATE TABLE store_settings (  is_approved boolean DEFAULT false,

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  created_at timestamptz DEFAULT now(),

    setting_key TEXT UNIQUE NOT NULL,

    setting_value JSONB,  CONSTRAINT review_author_check CHECK (

    setting_type TEXT DEFAULT 'text',    (user_id IS NOT NULL) OR

    is_public BOOLEAN DEFAULT false,    (guest_name IS NOT NULL AND guest_email IS NOT NULL)

    description TEXT,  )

    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,);

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL-- Coupons and discounts

);CREATE TABLE coupons (

  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

-- Admin logs table  code text UNIQUE NOT NULL,

CREATE TABLE admin_logs (  name text NOT NULL,

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  description text,

    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),

    action TEXT NOT NULL,  discount_value decimal(10,2) NOT NULL CHECK (discount_value > 0),

    entity_type TEXT NOT NULL,  minimum_order_amount decimal(10,2) DEFAULT 0,

    entity_id UUID,  max_discount_amount decimal(10,2),

    old_values JSONB,  usage_limit integer,

    new_values JSONB,  used_count integer DEFAULT 0,

    ip_address INET,  is_active boolean DEFAULT true,

    user_agent TEXT,  valid_from timestamptz DEFAULT now(),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL  valid_until timestamptz,

);  created_at timestamptz DEFAULT now()

);

-- Sales analytics table

CREATE TABLE sales_analytics (-- Payment methods configuration

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),CREATE TABLE payment_methods (

    date DATE NOT NULL,  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

    total_orders INTEGER DEFAULT 0,  name text NOT NULL,

    total_revenue DECIMAL(12,2) DEFAULT 0,  provider text NOT NULL, -- 'stripe', 'paypal', 'cod', etc.

    total_customers INTEGER DEFAULT 0,  is_active boolean DEFAULT true,

    avg_order_value DECIMAL(10,2) DEFAULT 0,  config jsonb, -- API keys, settings

    top_products JSONB DEFAULT '[]',  sort_order integer DEFAULT 0,

    top_categories JSONB DEFAULT '[]',  created_at timestamptz DEFAULT now(),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL  updated_at timestamptz DEFAULT now()

););



-- Page views table-- Shipping zones and rates

CREATE TABLE page_views (CREATE TABLE shipping_zones (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

    page_type TEXT NOT NULL,  name text NOT NULL,

    page_id UUID,  countries text[] DEFAULT '{}',

    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,  states text[] DEFAULT '{}',

    session_id TEXT,  is_active boolean DEFAULT true,

    ip_address INET,  created_at timestamptz DEFAULT now()

    user_agent TEXT,);

    referrer TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULLCREATE TABLE shipping_rates (

);  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

  zone_id uuid REFERENCES shipping_zones(id) ON DELETE CASCADE,

-- Search analytics table  name text NOT NULL,

CREATE TABLE search_analytics (  min_weight decimal(8,2),

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  max_weight decimal(8,2),

    search_term TEXT NOT NULL,  min_order_amount decimal(10,2),

    results_count INTEGER DEFAULT 0,  max_order_amount decimal(10,2),

    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,  rate decimal(10,2) NOT NULL,

    session_id TEXT,  estimated_days integer,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL  is_active boolean DEFAULT true,

);  created_at timestamptz DEFAULT now()

);

-- Create indexes for better performance

CREATE INDEX idx_products_category_id ON products(category_id);-- Email templates

CREATE INDEX idx_products_slug ON products(slug);CREATE TABLE email_templates (

CREATE INDEX idx_products_is_active ON products(is_active);  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

CREATE INDEX idx_products_is_featured ON products(is_featured);  name text NOT NULL,

CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);  subject text NOT NULL,

CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);  html_content text NOT NULL,

CREATE INDEX idx_cart_items_session_id ON cart_items(session_id);  text_content text,

CREATE INDEX idx_orders_user_id ON orders(user_id);  variables text[] DEFAULT '{}', -- Available variables

CREATE INDEX idx_orders_status ON orders(status);  is_active boolean DEFAULT true,

CREATE INDEX idx_order_items_order_id ON order_items(order_id);  created_at timestamptz DEFAULT now(),

CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);  updated_at timestamptz DEFAULT now()

CREATE INDEX idx_wishlists_user_id ON wishlists(user_id););

CREATE INDEX idx_sales_analytics_date ON sales_analytics(date);

-- Insert default email templates

-- FunctionsINSERT INTO email_templates (name, subject, html_content, text_content, variables) VALUES

CREATE OR REPLACE FUNCTION update_updated_at_column()('order_confirmation', 'Order Confirmation - {{order_number}}',

RETURNS TRIGGER AS $$ '<h1>Order Confirmed!</h1><p>Thank you for your order {{customer_name}}.</p>',

BEGIN 'Order Confirmed! Thank you for your order {{customer_name}}.',

    NEW.updated_at = timezone('utc'::text, now()); ARRAY['order_number', 'customer_name', 'order_total']),

    RETURN NEW;('order_shipped', 'Your Order Has Been Shipped',

END; '<h1>Order Shipped!</h1><p>Your order {{order_number}} has been shipped.</p>',

$$ LANGUAGE plpgsql; 'Your order {{order_number}} has been shipped.',

 ARRAY['order_number', 'tracking_number']);

-- Create triggers for updated_at columns

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();-- Admin notifications

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();CREATE TABLE admin_notifications (

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();  type notification_type NOT NULL,

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();  title text NOT NULL,

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();  message text NOT NULL,

CREATE TRIGGER update_store_settings_updated_at BEFORE UPDATE ON store_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();  data jsonb, -- Additional data

  is_read boolean DEFAULT false,

-- Function to generate order numbers  created_by uuid, -- Will add foreign key constraint later

CREATE OR REPLACE FUNCTION generate_order_number()  created_at timestamptz DEFAULT now()

RETURNS TEXT AS $$);

DECLARE

    new_number TEXT;-- Admin activity logs

BEGINCREATE TABLE admin_logs (

    new_number := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || LPAD((EXTRACT(EPOCH FROM now())::INTEGER % 100000)::TEXT, 5, '0');  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

    RETURN new_number;  admin_id uuid, -- Will add foreign key constraint later

END;  action text NOT NULL,

$$ LANGUAGE plpgsql;  entity_type text NOT NULL, -- 'product', 'order', 'user', etc.

  entity_id uuid,

-- Function to update product stock  old_values jsonb,

CREATE OR REPLACE FUNCTION update_product_stock()  new_values jsonb,

RETURNS TRIGGER AS $$  ip_address inet,

BEGIN  user_agent text,

    IF TG_OP = 'INSERT' THEN  created_at timestamptz DEFAULT now()

        -- Insert inventory movement record);

        INSERT INTO inventory_movements (

            product_id, variant_id, movement_type, quantity, -- Analytics and tracking tables

            previous_stock, new_stock, reason, reference_id, reference_typeCREATE TABLE page_views (

        ) VALUES (  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

            NEW.product_id, NEW.variant_id, 'out', NEW.quantity,  page_type text NOT NULL,

            COALESCE((SELECT stock_quantity FROM products WHERE id = NEW.product_id), 0),  page_id uuid, -- product_id, category_id, etc.

            COALESCE((SELECT stock_quantity FROM products WHERE id = NEW.product_id), 0) - NEW.quantity,  user_id uuid REFERENCES profiles(id),

            'Order placed', NEW.order_id, 'order'  session_id text,

        );  ip_address inet,

          user_agent text,

        -- Update product stock  referrer text,

        UPDATE products   created_at timestamptz DEFAULT now()

        SET stock_quantity = stock_quantity - NEW.quantity);

        WHERE id = NEW.product_id;

        CREATE TABLE search_analytics (

    END IF;  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

    RETURN COALESCE(NEW, OLD);  search_term text NOT NULL,

END;  results_count integer DEFAULT 0,

$$ LANGUAGE plpgsql;  user_id uuid REFERENCES profiles(id),

  session_id text,

-- Create trigger for stock updates  created_at timestamptz DEFAULT now()

CREATE TRIGGER trigger_update_product_stock );

    AFTER INSERT ON order_items 

    FOR EACH ROW EXECUTE FUNCTION update_product_stock();-- Sales analytics

CREATE TABLE sales_analytics (

-- Function to check low stock  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

CREATE OR REPLACE FUNCTION check_low_stock()  date date NOT NULL,

RETURNS TRIGGER AS $$  total_orders integer DEFAULT 0,

BEGIN  total_revenue decimal(12,2) DEFAULT 0,

    IF NEW.stock_quantity <= NEW.low_stock_threshold THEN  total_customers integer DEFAULT 0,

        INSERT INTO inventory_alerts (product_id, alert_type, threshold, current_stock)  avg_order_value decimal(10,2) DEFAULT 0,

        VALUES (NEW.id, 'low_stock', NEW.low_stock_threshold, NEW.stock_quantity)  top_products jsonb DEFAULT '[]',

        ON CONFLICT DO NOTHING;  top_categories jsonb DEFAULT '[]',

    END IF;  created_at timestamptz DEFAULT now(),

    RETURN NEW;

END;  UNIQUE(date)

$$ LANGUAGE plpgsql;);



-- Create trigger for low stock alerts-- Inventory tracking

CREATE TRIGGER trigger_check_low_stock CREATE TABLE inventory_movements (

    AFTER UPDATE OF stock_quantity ON products   id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

    FOR EACH ROW EXECUTE FUNCTION check_low_stock();  product_id uuid REFERENCES products(id),

  variant_id uuid REFERENCES product_variants(id),

-- Function to update sales analytics  movement_type text NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment', 'sale', 'return')),

CREATE OR REPLACE FUNCTION update_sales_analytics()  quantity integer NOT NULL,

RETURNS void AS $$  previous_stock integer,

DECLARE  new_stock integer,

    today_date DATE := CURRENT_DATE;  reason text,

    daily_stats RECORD;  reference_id uuid, -- order_id or other reference

BEGIN  reference_type text, -- 'order', 'adjustment', 'return'

    -- Calculate daily statistics  created_by uuid, -- Will add foreign key constraint later

    SELECT   created_at timestamptz DEFAULT now()

        COUNT(DISTINCT id) as order_count,);

        SUM(total_amount) as revenue,

        COUNT(DISTINCT user_id) as customer_count,-- Inventory alerts

        AVG(total_amount) as avg_order_valueCREATE TABLE inventory_alerts (

    INTO daily_stats  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

    FROM orders   product_id uuid REFERENCES products(id),

    WHERE DATE(created_at) = today_date AND status != 'cancelled';  variant_id uuid REFERENCES product_variants(id),

      alert_type text NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock', 'overstock')),

    -- Insert or update daily analytics  threshold integer,

    INSERT INTO sales_analytics (date, total_orders, total_revenue, total_customers, avg_order_value)  current_stock integer,

    VALUES (today_date, daily_stats.order_count, daily_stats.revenue, daily_stats.customer_count, daily_stats.avg_order_value)  is_resolved boolean DEFAULT false,

    ON CONFLICT (date) DO UPDATE SET  resolved_at timestamptz,

        total_orders = EXCLUDED.total_orders,  created_at timestamptz DEFAULT now()

        total_revenue = EXCLUDED.total_revenue,);

        total_customers = EXCLUDED.total_customers,

        avg_order_value = EXCLUDED.avg_order_value;-- Reports configuration

END;CREATE TABLE reports (

$$ LANGUAGE plpgsql;  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

  name text NOT NULL,

-- Enable Row Level Security (RLS) on all tables  type report_type NOT NULL,

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;  config jsonb, -- Report configuration

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;  schedule text, -- cron expression

ALTER TABLE products ENABLE ROW LEVEL SECURITY;  is_active boolean DEFAULT true,

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;  last_run timestamptz,

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;  next_run timestamptz,

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;  created_by uuid, -- Will add foreign key constraint later

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;  created_at timestamptz DEFAULT now(),

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;  updated_at timestamptz DEFAULT now()

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;-- Backup configuration

ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;CREATE TABLE backups (

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;  name text NOT NULL,

ALTER TABLE sales_analytics ENABLE ROW LEVEL SECURITY;  type text NOT NULL, -- 'database', 'files', 'full'

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;  status backup_status DEFAULT 'pending',

ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;  file_path text,

  file_size bigint,

-- RLS Policies for public read access to products and categories  started_at timestamptz,

CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (is_active = true);  completed_at timestamptz,

CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (is_active = true);  created_by uuid, -- Will add foreign key constraint later

CREATE POLICY "Product variants are viewable by everyone" ON product_variants FOR SELECT USING (is_active = true);  created_at timestamptz DEFAULT now()

);

-- RLS Policies for user-specific data

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);-- Performance indexes

CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);CREATE INDEX idx_products_category ON products(category_id);

CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;

-- RLS Policies for cart itemsCREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;

CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);CREATE INDEX idx_products_search ON products USING gin(name gin_trgm_ops, description gin_trgm_ops);

CREATE INDEX idx_orders_user ON orders(user_id);

-- RLS Policies for ordersCREATE INDEX idx_orders_status ON orders(status);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);CREATE INDEX idx_orders_date ON orders(created_at DESC);

CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (CREATE INDEX idx_cart_user ON cart_items(user_id);

    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())CREATE INDEX idx_cart_session ON cart_items(session_id);

);CREATE INDEX idx_variants_product ON product_variants(product_id);

CREATE INDEX idx_inventory_product ON inventory_movements(product_id);

-- RLS Policies for wishlistsCREATE INDEX idx_inventory_date ON inventory_movements(created_at DESC);

CREATE POLICY "Users can manage own wishlist" ON wishlists FOR ALL USING (auth.uid() = user_id);CREATE INDEX idx_sales_date ON sales_analytics(date DESC);

CREATE INDEX idx_alerts_resolved ON inventory_alerts(is_resolved) WHERE is_resolved = false;

-- RLS Policies for product reviews

CREATE POLICY "Product reviews are viewable by everyone" ON product_reviews FOR SELECT USING (is_approved = true);-- Row Level Security Policies

CREATE POLICY "Users can manage own reviews" ON product_reviews FOR ALL USING (auth.uid() = user_id);ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Admin policies (for users with admin role)ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything" ON products FOR ALL USING (ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin'))ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

);ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin'))ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

);ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage variants" ON product_variants FOR ALL USING (ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;

    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin'))ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;

);ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all orders" ON orders FOR ALL USING (ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin'))ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;

);ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;



CREATE POLICY "Admins can view all order items" ON order_items FOR ALL USING (-- Policies for products (public read, admin write)

    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin'))CREATE POLICY "Public can view active products" ON products

);  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" ON products

-- Insert default store settings  FOR ALL USING (EXISTS (

INSERT INTO store_settings (setting_key, setting_value, setting_type, is_public, description) VALUES    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')

('store_name', '"Your Store Name"', 'text', true, 'The name of your store'),  ));

('store_description', '"Your store description"', 'text', true, 'Store description for SEO'),

('store_email', '"store@example.com"', 'email', true, 'Store contact email'),-- Policies for orders (users see own orders, admins see all)

('store_phone', '"+1234567890"', 'text', true, 'Store contact phone'),CREATE POLICY "Users can view own orders" ON orders

('currency', '"USD"', 'text', true, 'Default store currency'),  FOR SELECT USING (user_id = auth.uid() OR EXISTS (

('tax_rate', '0.08', 'number', true, 'Default tax rate'),    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')

('shipping_rate', '5.99', 'number', true, 'Default shipping rate'),  ));

('free_shipping_threshold', '50.00', 'number', true, 'Free shipping threshold'),

('allow_guest_checkout', 'true', 'boolean', true, 'Allow guest checkout');CREATE POLICY "Admins can manage orders" ON orders

  FOR ALL USING (EXISTS (

-- Insert default categories    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')

INSERT INTO categories (name, slug, description, is_active, sort_order) VALUES  ));

('Electronics', 'electronics', 'Electronic devices and accessories', true, 1),

('Home & Kitchen', 'home-kitchen', 'Home and kitchen essentials', true, 2),-- Policies for cart (users manage own cart)

('Fashion', 'fashion', 'Clothing and fashion accessories', true, 3),CREATE POLICY "Users can manage own cart" ON cart_items

('Sports & Outdoors', 'sports-outdoors', 'Sports and outdoor equipment', true, 4),  FOR ALL USING (user_id = auth.uid());

('Books', 'books', 'Books and educational materials', true, 5);

-- Policies for store settings (admins only)

-- Grant necessary permissionsCREATE POLICY "Admins can manage store settings" ON store_settings

GRANT USAGE ON SCHEMA public TO anon, authenticated;  FOR ALL USING (EXISTS (

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')

GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;  ));

GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
-- Policies for admin logs (admins only)
CREATE POLICY "Admins can view admin logs" ON admin_logs
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

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

-- Function to update product stock
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Decrease stock when order item is created
    UPDATE products
    SET stock_quantity = stock_quantity - NEW.quantity,
        sales_count = sales_count + NEW.quantity
    WHERE id = NEW.product_id;

    -- Log inventory movement
    INSERT INTO inventory_movements (
      product_id, movement_type, quantity, previous_stock, new_stock,
      reason, reference_id, reference_type
    )
    SELECT NEW.product_id, 'sale', NEW.quantity,
           p.stock_quantity + NEW.quantity, p.stock_quantity,
           'Order placed', NEW.order_id, 'order'
    FROM products p WHERE p.id = NEW.product_id;

    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to check low stock alerts
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if product is below low stock threshold
  IF NEW.stock_quantity <= (SELECT low_stock_threshold FROM products WHERE id = NEW.id) THEN
    INSERT INTO inventory_alerts (product_id, alert_type, threshold, current_stock)
    VALUES (NEW.id, 'low_stock',
            (SELECT low_stock_threshold FROM products WHERE id = NEW.id),
            NEW.stock_quantity)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Check if product is out of stock
  IF NEW.stock_quantity = 0 THEN
    INSERT INTO inventory_alerts (product_id, alert_type, threshold, current_stock)
    VALUES (NEW.id, 'out_of_stock', 0, 0)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update sales analytics
CREATE OR REPLACE FUNCTION update_sales_analytics()
RETURNS void AS $$
DECLARE
  today_date date := CURRENT_DATE;
  daily_stats record;
BEGIN
  -- Calculate daily stats
  SELECT
    COUNT(*) as order_count,
    COALESCE(SUM(total_amount), 0) as revenue,
    COUNT(DISTINCT user_id) as customer_count,
    COALESCE(AVG(total_amount), 0) as avg_order_value
  INTO daily_stats
  FROM orders
  WHERE DATE(created_at) = today_date
    AND status NOT IN ('cancelled', 'refunded');

  -- Insert or update daily analytics
  INSERT INTO sales_analytics (
    date, total_orders, total_revenue, total_customers, avg_order_value
  ) VALUES (
    today_date,
    daily_stats.order_count,
    daily_stats.revenue,
    daily_stats.customer_count,
    daily_stats.avg_order_value
  )
  ON CONFLICT (date) DO UPDATE SET
    total_orders = EXCLUDED.total_orders,
    total_revenue = EXCLUDED.total_revenue,
    total_customers = EXCLUDED.total_customers,
    avg_order_value = EXCLUDED.avg_order_value;
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

-- Create triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_variants_updated_at BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_store_settings_updated_at BEFORE UPDATE ON store_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for stock updates
CREATE TRIGGER trigger_update_product_stock AFTER INSERT ON order_items
  FOR EACH ROW EXECUTE FUNCTION update_product_stock();

-- Trigger for low stock alerts
CREATE TRIGGER trigger_check_low_stock AFTER UPDATE OF stock_quantity ON products
  FOR EACH ROW EXECUTE FUNCTION check_low_stock();

-- Scheduled job to update sales analytics daily (requires pg_cron)
-- SELECT cron.schedule('update-sales-analytics', '0 1 * * *', 'SELECT update_sales_analytics();');

-- Sample data for testing
INSERT INTO categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Electronic devices and gadgets'),
('Clothing', 'clothing', 'Fashion and apparel'),
('Home & Garden', 'home-garden', 'Home improvement and garden supplies');

INSERT INTO products (name, slug, description, base_price, category_id, stock_quantity) VALUES
('Wireless Headphones', 'wireless-headphones', 'High-quality wireless headphones', 99.99,
 (SELECT id FROM categories WHERE slug = 'electronics'), 50),
('Cotton T-Shirt', 'cotton-t-shirt', 'Comfortable cotton t-shirt', 19.99,
 (SELECT id FROM categories WHERE slug = 'clothing'), 100),
('Garden Hose', 'garden-hose', 'Durable garden hose', 29.99,
 (SELECT id FROM categories WHERE slug = 'home-garden'), 25);

-- Add all foreign key constraints after all tables are created
ALTER TABLE store_settings ADD CONSTRAINT fk_store_settings_updated_by
  FOREIGN KEY (updated_by) REFERENCES profiles(id);

ALTER TABLE admin_notifications ADD CONSTRAINT fk_admin_notifications_created_by
  FOREIGN KEY (created_by) REFERENCES profiles(id);

ALTER TABLE admin_logs ADD CONSTRAINT fk_admin_logs_admin_id
  FOREIGN KEY (admin_id) REFERENCES profiles(id);

ALTER TABLE inventory_movements ADD CONSTRAINT fk_inventory_movements_created_by
  FOREIGN KEY (created_by) REFERENCES profiles(id);

ALTER TABLE reports ADD CONSTRAINT fk_reports_created_by
  FOREIGN KEY (created_by) REFERENCES profiles(id);

ALTER TABLE backups ADD CONSTRAINT fk_backups_created_by
  FOREIGN KEY (created_by) REFERENCES profiles(id);
