# Supabase Setup Guide - It's Your Choice

## 🚀 Quick Setup Instructions

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
  'admin@itsyourchoice.com',
  crypt('your_secure_password', gen_salt('bf')),
  now(),
  now(),
  now()
);

-- Get the user ID from the query above, then run:
INSERT INTO profiles (id, full_name, email, role, created_at, updated_at)
VALUES (
  'paste-user-id-here', -- Replace with actual UUID
  'Admin User',
  'admin@itsyourchoice.com',
  'admin',
  now(),
  now()
);
```

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

1. **Signup**: Create a new user account
2. **Verify Email**: Check email for verification link
3. **Login**: Sign in with your credentials
4. **Admin Access**: Login with admin account and visit `/admin`
5. **Route Protection**: Try accessing `/admin` without login (should redirect)

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
