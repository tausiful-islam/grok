# Database Policy Fix

## Problem
The profiles table has infinite recursion in its RLS policies. This happens when a policy tries to check the profiles table to determine access to the profiles table.

## Solution
We need to fix the admin policy that's causing the recursion.

## SQL Commands to Run in Supabase SQL Editor

```sql
-- 1. Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- 2. Create simple, non-recursive policies
-- Users can view their own profile (using auth.uid() directly)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (using auth.uid() directly)
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 3. For admin access, we'll handle this in the application code instead of RLS
-- This avoids the recursive policy issue
```

## Alternative: Disable RLS for now and rely on application-level security

```sql
-- Temporarily disable RLS to test
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

## After running the fix, test admin login again.
