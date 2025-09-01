-- Optional Database Enhancements
-- Add these tables only if you need the specific functionality

-- 1. Customer Addresses (for multiple shipping addresses)
CREATE TABLE customer_addresses (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  label text NOT NULL, -- 'Home', 'Office', 'Parents House'
  name text NOT NULL,
  phone text,
  address_line_1 text NOT NULL,
  address_line_2 text,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'Bangladesh',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Payment Methods (for saved cards/payment info)
CREATE TABLE payment_methods (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'card', 'bank', 'mobile_banking'
  provider text, -- 'visa', 'mastercard', 'bkash', 'nagad'
  last_four text, -- Last 4 digits for cards
  name text NOT NULL, -- Name on card or account
  is_default boolean DEFAULT false,
  is_active boolean DEFAULT true,
  expires_at date, -- For cards
  created_at timestamptz DEFAULT now()
);

-- 3. Shipping Methods
CREATE TABLE shipping_methods (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text,
  base_cost decimal(10,2) NOT NULL DEFAULT 0,
  cost_per_weight decimal(10,2) DEFAULT 0,
  free_shipping_threshold decimal(10,2),
  estimated_days_min integer DEFAULT 1,
  estimated_days_max integer DEFAULT 7,
  is_active boolean DEFAULT true,
  available_regions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 4. Return/Refund Requests
CREATE TABLE return_requests (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id uuid REFERENCES orders(id),
  order_item_id uuid REFERENCES order_items(id),
  user_id uuid REFERENCES profiles(id),
  reason text NOT NULL,
  description text,
  status text DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed'
  refund_amount decimal(10,2),
  admin_notes text,
  images text[] DEFAULT '{}',
  processed_by uuid REFERENCES profiles(id),
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 5. Tax Rates (for multi-region tax support)
CREATE TABLE tax_rates (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  rate decimal(5,4) NOT NULL, -- e.g., 0.0825 for 8.25%
  country text DEFAULT 'BD',
  state text,
  city text,
  postal_code text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 6. Product Questions & Answers
CREATE TABLE product_questions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  question text NOT NULL,
  answer text,
  answered_by uuid REFERENCES profiles(id),
  is_public boolean DEFAULT true,
  answered_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 7. Abandoned Cart Recovery
CREATE TABLE abandoned_carts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  session_id text,
  email text,
  cart_value decimal(10,2),
  recovery_email_sent boolean DEFAULT false,
  recovery_email_sent_at timestamptz,
  recovered_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 8. Product Collections/Sets
CREATE TABLE product_collections (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE collection_products (
  collection_id uuid REFERENCES product_collections(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (collection_id, product_id)
);

-- Indexes for new tables
CREATE INDEX idx_customer_addresses_user ON customer_addresses(user_id);
CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);
CREATE INDEX idx_return_requests_order ON return_requests(order_id);
CREATE INDEX idx_product_questions_product ON product_questions(product_id);
CREATE INDEX idx_abandoned_carts_email ON abandoned_carts(email);
