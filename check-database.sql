-- Check if profiles table exists and has correct structure
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE tablename = 'profiles';

-- Check profiles table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Check if user_role enum exists
SELECT
  n.nspname AS schema_name,
  t.typname AS type_name,
  e.enumlabel AS enum_value
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_namespace n ON t.typnamespace = n.oid
WHERE t.typname = 'user_role'
ORDER BY e.enumsortorder;

-- Check RLS policies on profiles table
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles';

-- Check if there are any existing profiles
SELECT
  id,
  name,
  role,
  is_active,
  created_at
FROM profiles
LIMIT 5;
