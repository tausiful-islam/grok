-- Fix Admin Profile
-- This script creates the admin profile for the existing admin user

-- First, let's check if admin user exists in auth.users
-- You should run this in Supabase SQL Editor

-- Step 1: Find the admin user ID
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'tausiful11@gmail.com';

-- Step 2: Insert the admin profile using the correct user ID
-- Replace 'YOUR_USER_ID_HERE' with the actual ID from step 1
INSERT INTO profiles (id, name, role, is_active, total_orders, total_spent, created_at, updated_at)
VALUES (
  'YOUR_USER_ID_HERE',  -- Replace with actual user ID from step 1
  'Tausiful Islam',
  'admin',
  true,
  0,
  0,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  updated_at = now();

-- Step 3: Verify the profile was created
SELECT p.*, u.email 
FROM profiles p 
JOIN auth.users u ON p.id = u.id 
WHERE u.email = 'tausiful11@gmail.com';
