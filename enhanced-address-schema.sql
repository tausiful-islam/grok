-- Enhanced Address System for Profiles
-- This extends the existing profiles table to support structured addresses

-- Customer Addresses table with Bangladesh address structure
CREATE TABLE IF NOT EXISTS customer_addresses (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT 'Home', -- 'Home', 'Office', 'Other'
  name text NOT NULL,
  phone text,
  division_id uuid REFERENCES divisions(id),
  district_id uuid REFERENCES districts(id),
  home_address text NOT NULL, -- Street address, house number, etc.
  postal_code text,
  is_default boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure division and district are compatible
  CONSTRAINT valid_district_division CHECK (
    district_id IS NULL OR 
    EXISTS (SELECT 1 FROM districts WHERE id = district_id AND division_id = customer_addresses.division_id)
  )
);

-- Function to ensure only one default address per user
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    -- Set all other addresses for this user to non-default
    UPDATE customer_addresses 
    SET is_default = false 
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  
  -- If this is the first address for the user, make it default
  IF NOT EXISTS (SELECT 1 FROM customer_addresses WHERE user_id = NEW.user_id AND is_default = true AND id != NEW.id) THEN
    NEW.is_default = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for default address management
CREATE TRIGGER trigger_ensure_single_default_address
  BEFORE INSERT OR UPDATE ON customer_addresses
  FOR EACH ROW EXECUTE FUNCTION ensure_single_default_address();

-- Create updated_at trigger
CREATE TRIGGER update_customer_addresses_updated_at 
  BEFORE UPDATE ON customer_addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_customer_addresses_user ON customer_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_division ON customer_addresses(division_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_district ON customer_addresses(district_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_default ON customer_addresses(user_id, is_default) WHERE is_default = true;

-- Enable RLS
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;

-- Policies for customer addresses
CREATE POLICY "Users can manage own addresses" ON customer_addresses
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all addresses" ON customer_addresses
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));
