-- Simple Admin Profile Creation
-- Run this in Supabase SQL Editor

-- First, check what user ID we have for the admin
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'tausiful11@gmail.com';

-- Then manually create the profile (replace the UUID below with the actual user ID from above)
-- You'll need to copy the ID from the first query and paste it in the second query

-- STEP 1: Copy the UUID from the query above
-- STEP 2: Replace 'PASTE_USER_ID_HERE' with that UUID in the query below

INSERT INTO profiles (id, name, email, role, is_active, total_orders, total_spent, created_at, updated_at)
VALUES (
  'PASTE_USER_ID_HERE',  -- Replace this with the actual UUID from step 1
  'Tausiful Islam',
  'tausiful11@gmail.com',
  'admin',
  true,
  0,
  0,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Step 3: Verify the profile was created
SELECT p.*, u.email as auth_email 
FROM profiles p 
JOIN auth.users u ON p.id = u.id 
WHERE p.email = 'tausiful11@gmail.com';
