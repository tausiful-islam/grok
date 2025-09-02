-- Debug Profile Issues
-- Run these queries in Supabase SQL Editor to diagnose the problem

-- 1. Check if profiles table exists and its structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. Check if auth.users table has your admin user
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'tausiful11@gmail.com';

-- 3. Check if profiles table has any records
SELECT COUNT(*) as total_profiles FROM profiles;

-- 4. Check if there's a profile for your admin user
SELECT p.*, u.email as auth_email 
FROM profiles p 
RIGHT JOIN auth.users u ON p.id = u.id 
WHERE u.email = 'tausiful11@gmail.com';

-- 5. Check if there are any RLS policies blocking access
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- 6. Try to manually create admin profile (if none exists)
-- First get the user ID
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'tausiful11@gmail.com';
    
    IF admin_user_id IS NOT NULL THEN
        -- Try to insert the profile
        INSERT INTO profiles (id, name, email, role, is_active, total_orders, total_spent)
        VALUES (
            admin_user_id,
            'Tausiful Islam',
            'tausiful11@gmail.com',
            'admin',
            true,
            0,
            0
        )
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            role = EXCLUDED.role,
            updated_at = now();
        
        RAISE NOTICE 'Admin profile created/updated for user ID: %', admin_user_id;
    ELSE
        RAISE NOTICE 'No user found with email: tausiful11@gmail.com';
    END IF;
END $$;

-- 7. Verify the profile was created
SELECT p.*, u.email as auth_email 
FROM profiles p 
JOIN auth.users u ON p.id = u.id 
WHERE u.email = 'tausiful11@gmail.com';
