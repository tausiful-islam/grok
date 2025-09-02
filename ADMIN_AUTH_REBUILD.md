# Admin Authentication System Rebuild

## Current Issue
- Admin user exists in `auth.users` but missing profile in `profiles` table
- Profile table structure mismatch between schema and documentation
- Admin login fails because profile retrieval fails

## Solution: Rebuild Profiles Table

### Step 1: Run the rebuild script
Execute `rebuild-profiles-table.sql` in Supabase SQL Editor:
- Drops existing profiles table
- Recreates with email field included
- Sets up proper RLS policies
- Automatically creates admin profile

### Step 2: Test admin login
After running the script, test login with:
- Email: `tausiful11@gmail.com`
- Password: `Aflame123$$`

### Step 3: Verify profile creation
Use `verify-admin.sql` to check if admin profile exists and has correct role.

## Authentication Flow
1. User enters credentials in admin login form
2. Supabase authenticates against `auth.users` table
3. System fetches profile from `profiles` table using user ID
4. Checks if profile.role is 'admin' or 'super_admin'
5. Grants/denies access based on role

## New Profiles Table Structure
```sql
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL, -- Added for easier lookup
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
```

## Admin Profile Data
- ID: (matches auth.users.id)
- Name: 'Tausiful Islam'
- Email: 'tausiful11@gmail.com'
- Role: 'admin'
- Is Active: true
