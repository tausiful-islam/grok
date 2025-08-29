# 🚀 Deployment Guide

Complete guide to deploy your E-Commerce Platform with Vercel and Supabase.

## 📋 Prerequisites

Before deploying, make sure you have:
- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))
- A Vercel account ([vercel.com](https://vercel.com))
- Git repository with your project

## 📋 Table of Contents

1. [Supabase Setup](#step-1-set-up-supabase)
2. [Vercel Deployment](#step-2-deploy-to-vercel)
3. [Access Admin Panel](#step-3-access-the-admin-panel)
4. [Environment Variables](#environment-variables)
5. [Database Schema](#database-schema)
6. [Troubleshooting](#troubleshooting)

## Step 1: Set Up Supabase

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in your project details:
   - **Name**: Choose a name for your project
   - **Database Password**: Create a strong password
   - **Region**: Select the closest region to your users
4. Click **"Create new project"**
5. Wait for the project to be fully set up (this may take a few minutes)

### 1.2 Set Up Database Schema

1. In your Supabase dashboard, go to **"SQL Editor"**
2. Click **"New query"**
3. Copy and paste the entire contents of `database-schema.sql` from your project
4. Click **"Run"** to execute the SQL script
5. Verify that all tables were created successfully

### 1.3 Configure Authentication (Optional)

If you plan to add user authentication later:

1. Go to **"Authentication"** > **"Settings"**
2. Configure your **Site URL** and **Redirect URLs**
3. Set up authentication providers (Google, GitHub, etc.) if needed

### 1.4 Get Your Environment Variables

You'll need these values for your Vercel deployment:

1. **Project URL & API Keys**:
   - Go to **"Settings"** > **"API"**
   - Copy your **Project URL**
   - Copy your **anon/public key**
   - Copy your **service_role key** (keep this secret!)

2. **Database Connection**:
   - Go to **"Settings"** > **"Database"**
   - Copy your **Connection string** (with password)

## Step 2: Deploy to Vercel

### 2.1 Connect Your Repository

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your Git repository:
   - Connect your GitHub/GitLab account
   - Select your repository
4. Configure the project:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: Leave as `./` (or your project root)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 2.2 Configure Environment Variables

In your Vercel project settings, add these environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database Connection (for potential future use)
DATABASE_URL=postgresql://postgres:[password]@db.your-project-id.supabase.co:5432/postgres

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

**Important**: Replace the placeholder values with your actual Supabase credentials.

### 2.3 Deploy

1. Click **"Deploy"**
2. Wait for the deployment to complete
3. Once deployed, you'll get a **`.vercel.app`** domain
4. You can also add a custom domain in Vercel's project settings

## Step 3: Access the Admin Panel

### 3.1 Navigate to Admin Panel

1. Visit your deployed site
2. Add `/admin` to the URL
3. Example: `https://your-project.vercel.app/admin`

### 3.2 Admin Panel Features

The admin panel includes these sections:

#### 📊 **Dashboard**
- Sales analytics and charts
- Recent orders overview
- Key performance metrics
- Top-selling products

#### 📦 **Products Management**
- View all products in a table
- Add new products
- Edit existing products
- Delete products
- Search and filter products
- Manage product status (active/inactive)

#### 📋 **Orders Management**
- View all customer orders
- Track order status
- Update order information
- View order details and customer info
- Filter orders by status

#### 👥 **Customers Management**
- View customer database
- Customer contact information
- Order history per customer
- Customer management tools

#### 🏷️ **Categories Management**
- Organize products by categories
- Add/edit/delete categories
- Manage category hierarchy

#### ⚙️ **Settings**
- Store information configuration
- Payment method settings
- Shipping rate configuration
- Email notification settings

## Environment Variables

### Required Variables

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public/anon key for client-side | Supabase Dashboard > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret service role key | Supabase Dashboard > Settings > API |
| `DATABASE_URL` | Database connection string | Supabase Dashboard > Settings > Database |
| `NEXT_PUBLIC_SITE_URL` | Your deployed site URL | Your Vercel domain |

### Security Notes

- 🔒 **Never commit** `.env.local` or any file containing real API keys to Git
- 🔒 **Service role key** should only be used server-side
- 🔒 **Anon key** is safe to use client-side but has Row Level Security restrictions
- 🔒 Regularly rotate your API keys for security

## Database Schema

The `database-schema.sql` file includes:

### Tables Created:
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Customer orders
- `order_items` - Order line items
- `customers` - Customer information
- `settings` - Store configuration

### Features:
- ✅ Foreign key relationships
- ✅ Indexes for performance
- ✅ Row Level Security policies
- ✅ Sample data for testing

## Troubleshooting

### Common Issues

#### ❌ **Build Fails on Vercel**
- Check that all environment variables are set correctly
- Verify your Supabase project is active
- Check Vercel build logs for specific errors

#### ❌ **Admin Panel Not Loading**
- Verify `/admin` route exists
- Check browser console for JavaScript errors
- Ensure all environment variables are configured

#### ❌ **Database Connection Issues**
- Verify Supabase project is running
- Check database password in connection string
- Ensure your IP is allowed (Supabase allows all by default)

#### ❌ **Environment Variables Not Working**
- Make sure variable names match exactly (case-sensitive)
- Redeploy after adding new variables
- Check Vercel environment variable settings

### Getting Help

1. **Check Vercel Logs**: Go to your project > Deployments > View Logs
2. **Check Supabase Logs**: Go to your project > Reports > API logs
3. **Browser Console**: Open DevTools and check for JavaScript errors
4. **Network Tab**: Check for failed API requests

### Useful Commands

```bash
# Test build locally
npm run build

# Start development server
npm run dev

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Test Supabase connection
npx supabase status
```

## 🔒 Security Considerations

### For Production:
- ✅ Add authentication to admin panel
- ✅ Implement rate limiting
- ✅ Set up monitoring and alerts
- ✅ Use HTTPS (Vercel provides this automatically)
- ✅ Regularly update dependencies
- ✅ Set up database backups

### Admin Panel Security:
- Currently open access (no authentication required)
- Consider adding password protection or user authentication
- Implement role-based access control if needed

## 📞 Support

If you need help:

1. **Documentation**: Check [Next.js Docs](https://nextjs.org/docs) and [Supabase Docs](https://supabase.com/docs)
2. **Community**: Join [Vercel Discord](https://vercel.com/discord) or [Supabase Discord](https://supabase.com/discord)
3. **Issues**: Check GitHub issues in the original repository

---

**Happy Deploying! 🎉**

Your E-Commerce Platform is now ready for the world.
