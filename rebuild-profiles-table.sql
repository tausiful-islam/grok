-- Drop and Recreate Profiles Table
-- Run this in Supabase SQL Editor

-- Step 1: Drop the existing profiles table and its dependencies
DROP TABLE IF EXISTS profiles CASCADE;

-- Step 2: Recreate the profiles table with the correct structure
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

-- Step 3: Create indexes for better performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_is_active ON profiles(is_active);

-- Step 4: Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS Policies
-- Users can view/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Step 6: Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Manually create the admin profile
-- First, find the admin user ID from auth.users
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get the admin user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'tausiful11@gmail.com';
    
    -- If admin user exists, create the profile
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO profiles (id, name, email, role, is_active, total_orders, total_spent, created_at, updated_at)
        VALUES (
            admin_user_id,
            'Tausiful Islam',
            'tausiful11@gmail.com',
            'admin',
            true,
            0,
            0,
            now(),
            now()
        );
        
        RAISE NOTICE 'Admin profile created successfully for user ID: %', admin_user_id;
    ELSE
        RAISE NOTICE 'Admin user with email tausiful11@gmail.com not found in auth.users';
    END IF;
END $$;

-- Step 8: Verify the admin profile was created
SELECT 
    p.id,
    p.name,
    p.email,
    p.role,
    p.is_active,
    u.email as auth_email,
    u.created_at as user_created_at
FROM profiles p 
JOIN auth.users u ON p.id = u.id 
WHERE p.email = 'tausiful11@gmail.com';
