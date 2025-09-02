-- E-commerce Platform Database Schema
-- Supabase PostgreSQL Setup
-- Enhanced for Full Admin Control

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Custom types
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'super_admin');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE variant_type AS ENUM ('color', 'size', 'version', 'material', 'style');
CREATE TYPE notification_type AS ENUM ('order', 'inventory', 'system', 'payment');
CREATE TYPE report_type AS ENUM ('sales', 'inventory', 'customers', 'products');
CREATE TYPE backup_status AS ENUM ('pending', 'running', 'completed', 'failed');

-- Store Settings Table (moved before profiles to avoid dependency issues)
CREATE TABLE store_settings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb,
  setting_type text DEFAULT 'string',
  is_public boolean DEFAULT false,
  description text,
  updated_by uuid, -- Will add foreign key constraint later
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default store settings
INSERT INTO store_settings (setting_key, setting_value, setting_type, is_public, description) VALUES
('store_name', '"It\'s Your Choice"', 'string', true, 'Store name displayed throughout the site'),
('store_email', '"support@eshop.com"', 'string', true, 'Primary contact email'),
('store_phone', '["+1 (555) 123-4567"]', 'array', true, 'Store phone numbers'),
('store_address', '{"street": "123 Commerce Street", "city": "Business District", "state": "NY", "zip": "10001", "country": "USA"}', 'object', true, 'Store physical address'),
('currency', '"BDT"', 'string', true, 'Default currency code'),
('timezone', '"UTC"', 'string', false, 'Store timezone'),
('maintenance_mode', 'false', 'boolean', false, 'Enable maintenance mode'),
('allow_guest_checkout', 'true', 'boolean', false, 'Allow guest checkout'),
('min_order_amount', '0', 'number', false, 'Minimum order amount'),
('free_shipping_threshold', '50', 'number', true, 'Free shipping threshold'),
('tax_rate', '0', 'number', false, 'Default tax rate percentage'),
('default_weight_unit', '"kg"', 'string', false, 'Default weight unit'),
('default_dimension_unit', '"cm"', 'string', false, 'Default dimension unit');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL, -- Adding email field for easier admin lookup
  role user_role DEFAULT 'customer',
  phone text,
  address jsonb,
  avatar_url text,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  total_orders integer DEFAULT 0,
  total_spent decimal(12,2) DEFAULT 0,
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
  product_count integer DEFAULT 0,
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

-- Payment methods configuration
CREATE TABLE payment_methods (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  provider text NOT NULL, -- 'stripe', 'paypal', 'cod', etc.
  is_active boolean DEFAULT true,
  config jsonb, -- API keys, settings
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Shipping zones and rates
CREATE TABLE shipping_zones (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  countries text[] DEFAULT '{}',
  states text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE shipping_rates (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  zone_id uuid REFERENCES shipping_zones(id) ON DELETE CASCADE,
  name text NOT NULL,
  min_weight decimal(8,2),
  max_weight decimal(8,2),
  min_order_amount decimal(10,2),
  max_order_amount decimal(10,2),
  rate decimal(10,2) NOT NULL,
  estimated_days integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Email templates
CREATE TABLE email_templates (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  subject text NOT NULL,
  html_content text NOT NULL,
  text_content text,
  variables text[] DEFAULT '{}', -- Available variables
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default email templates
INSERT INTO email_templates (name, subject, html_content, text_content, variables) VALUES
('order_confirmation', 'Order Confirmation - {{order_number}}',
 '<h1>Order Confirmed!</h1><p>Thank you for your order {{customer_name}}.</p>',
 'Order Confirmed! Thank you for your order {{customer_name}}.',
 ARRAY['order_number', 'customer_name', 'order_total']),
('order_shipped', 'Your Order Has Been Shipped',
 '<h1>Order Shipped!</h1><p>Your order {{order_number}} has been shipped.</p>',
 'Your order {{order_number}} has been shipped.',
 ARRAY['order_number', 'tracking_number']);

-- Admin notifications
CREATE TABLE admin_notifications (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb, -- Additional data
  is_read boolean DEFAULT false,
  created_by uuid, -- Will add foreign key constraint later
  created_at timestamptz DEFAULT now()
);

-- Admin activity logs
CREATE TABLE admin_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id uuid, -- Will add foreign key constraint later
  action text NOT NULL,
  entity_type text NOT NULL, -- 'product', 'order', 'user', etc.
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
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

-- Sales analytics
CREATE TABLE sales_analytics (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  date date NOT NULL,
  total_orders integer DEFAULT 0,
  total_revenue decimal(12,2) DEFAULT 0,
  total_customers integer DEFAULT 0,
  avg_order_value decimal(10,2) DEFAULT 0,
  top_products jsonb DEFAULT '[]',
  top_categories jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),

  UNIQUE(date)
);

-- Inventory tracking
CREATE TABLE inventory_movements (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id uuid REFERENCES products(id),
  variant_id uuid REFERENCES product_variants(id),
  movement_type text NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment', 'sale', 'return')),
  quantity integer NOT NULL,
  previous_stock integer,
  new_stock integer,
  reason text,
  reference_id uuid, -- order_id or other reference
  reference_type text, -- 'order', 'adjustment', 'return'
  created_by uuid, -- Will add foreign key constraint later
  created_at timestamptz DEFAULT now()
);

-- Inventory alerts
CREATE TABLE inventory_alerts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id uuid REFERENCES products(id),
  variant_id uuid REFERENCES product_variants(id),
  alert_type text NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock', 'overstock')),
  threshold integer,
  current_stock integer,
  is_resolved boolean DEFAULT false,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Reports configuration
CREATE TABLE reports (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  type report_type NOT NULL,
  config jsonb, -- Report configuration
  schedule text, -- cron expression
  is_active boolean DEFAULT true,
  last_run timestamptz,
  next_run timestamptz,
  created_by uuid, -- Will add foreign key constraint later
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Backup configuration
CREATE TABLE backups (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL, -- 'database', 'files', 'full'
  status backup_status DEFAULT 'pending',
  file_path text,
  file_size bigint,
  started_at timestamptz,
  completed_at timestamptz,
  created_by uuid, -- Will add foreign key constraint later
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
CREATE INDEX idx_inventory_product ON inventory_movements(product_id);
CREATE INDEX idx_inventory_date ON inventory_movements(created_at DESC);
CREATE INDEX idx_sales_date ON sales_analytics(date DESC);
CREATE INDEX idx_alerts_resolved ON inventory_alerts(is_resolved) WHERE is_resolved = false;

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
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Admins can manage orders" ON orders
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- Policies for cart (users manage own cart)
CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL USING (user_id = auth.uid());

-- Policies for store settings (admins only)
CREATE POLICY "Admins can manage store settings" ON store_settings
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

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
