-- Complete Admin Creation Script
-- Run this in Supabase SQL Editor

DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
    admin_email TEXT := 'admin@yourdomain.com';  -- Change this email
    admin_password TEXT := 'SecurePassword123!';  -- Change this password
    admin_name TEXT := 'Admin User';  -- Change this name
BEGIN
    -- Create user in auth.users
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        aud,
        role
    ) VALUES (
        new_user_id,
        admin_email,
        crypt(admin_password, gen_salt('bf')),  -- Hash the password
        now(),
        now(),
        now(),
        'authenticated',
        'authenticated'
    );

    -- Create profile in profiles table
    INSERT INTO profiles (id, name, email, role, is_active, total_orders, total_spent, created_at, updated_at)
    VALUES (
        new_user_id,
        admin_name,
        admin_email,
        'admin',
        true,
        0,
        0,
        now(),
        now()
    );

    -- Output the results
    RAISE NOTICE 'Admin user created successfully:';
    RAISE NOTICE 'Email: %', admin_email;
    RAISE NOTICE 'Password: %', admin_password;
    RAISE NOTICE 'User ID: %', new_user_id;
    
END $$;

-- Verify the admin was created
SELECT 
    p.id,
    p.name,
    p.email,
    p.role,
    p.is_active,
    u.email as auth_email,
    u.created_at
FROM profiles p 
JOIN auth.users u ON p.id = u.id 
WHERE p.role IN ('admin', 'super_admin')
ORDER BY p.created_at DESC;
