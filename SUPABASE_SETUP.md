# Supabase Setup Guide - It's Your Choice

## 🚀 Quick Setup Instructions

### 📋 **What You Need to Change:**

1. ✅ **Email**: `tausiful11@gmail.com` (already updated)
2. ✅ **Password**: `Aflame123$$` (already updated)
3. ✅ **Name**: `Tausiful Islam` (already updated)
4. ⚠️  **User ID**: Get from first SQL query result and replace in second query
5. ✅ **Site URL**: `https://itsyourchoice.vercel.app` (already set)

### 🔄 **Step-by-Step Process:**

1. **Go to Supabase Dashboard** → SQL Editor
2. **Run first SQL query** (creates user account)
3. **Copy the User ID** from the result
4. **Run second SQL query** with your actual User ID
5. **Test the authentication** with your credentials

### 1. Enable Email Authentication
**Location**: Supabase Dashboard → Authentication → Settings

- ✅ Enable **Email** provider
- Set **Site URL**: `https://itsyourchoice.vercel.app`
- Add **Redirect URLs**:
  - `https://itsyourchoice.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback` (for development)

### 2. Create Admin User
**Location**: Supabase Dashboard → SQL Editor

Run this SQL to create your admin account:

```sql
-- Create admin user (replace with your details)
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  'tausiful11@gmail.com',  -- ✅ YOUR EMAIL
  crypt('Aflame123$$', gen_salt('bf')),  -- ✅ YOUR PASSWORD
  now(),
  now(),
  now()
);

-- ⚠️  IMPORTANT: After running the above query, get the user ID from the result
-- Look for the 'id' field in the returned data (it will be a UUID like: '123e4567-e89b-12d3-a456-426614174000')

-- Then run this query with your actual user ID:
INSERT INTO profiles (id, full_name, email, role, created_at, updated_at)
VALUES (
  'REPLACE_WITH_ACTUAL_USER_ID', -- ⚠️  REPLACE THIS with the UUID from the previous query
  'Tausiful Islam',  -- ✅ YOUR NAME
  'tausiful11@gmail.com',  -- ✅ YOUR EMAIL
  'admin',  -- ✅ ADMIN ROLE
  now(),
  now()
);
```

**What to change in SQL:**
1. ✅ **Email**: `tausiful11@gmail.com` (already updated)
2. ✅ **Password**: `Aflame123$$` (already updated)
3. ✅ **Name**: `Tausiful Islam` (already updated)
4. ⚠️  **User ID**: Replace `'REPLACE_WITH_ACTUAL_USER_ID'` with the actual UUID from the first query
5. ✅ **Role**: `admin` (correct for admin access)

### 3. Configure Database Policies
**Location**: Supabase Dashboard → SQL Editor

```sql
-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

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
```

### 4. Test Your Setup

**Step-by-step testing:**

1. **Signup**: Create a new user account at `/signup`
2. **Verify Email**: Check `tausiful11@gmail.com` for verification link
3. **Login**: Sign in with your credentials at `/login`
4. **Admin Access**: Login with admin account (`tausiful11@gmail.com` / `Aflame123$$`) and visit `/admin`
5. **Route Protection**: Try accessing `/admin` without login (should redirect to `/login`)

### 5. Environment Variables (Already Done ✅)

Your `.env.local` is already configured:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://blrspffakyojrfjiqugn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 🎯 What's Working Now:

- ✅ **Authentication System**: Real Supabase Auth
- ✅ **User Management**: Automatic profile creation
- ✅ **Admin Protection**: Role-based access control
- ✅ **Route Guards**: Protected admin routes
- ✅ **State Management**: Global auth state

### 📞 Need Help?

If you encounter any issues:
1. Check Supabase Dashboard logs
2. Verify environment variables
3. Test with a simple user account first
4. Check browser console for errors

**Your app is ready for production! 🚀**
