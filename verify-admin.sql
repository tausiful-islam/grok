-- Simple Admin Verification Query
-- You can use this to verify admin access during login

-- Check if user with email exists and has admin role
SELECT 
    p.id,
    p.name,
    p.email,
    p.role,
    p.is_active,
    u.email as auth_email
FROM profiles p 
JOIN auth.users u ON p.id = u.id 
WHERE p.email = 'tausiful11@gmail.com' 
AND p.role IN ('admin', 'super_admin')
AND p.is_active = true;
