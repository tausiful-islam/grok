# E-Commerce Platform

A modern, full-featured e-commerce platform built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Features a complete admin panel for store management and a responsive customer-facing storefront.

## 🚀 Features

### Customer Features
- **Product Catalog**: Browse products by categories with advanced filtering
- **Product Details**: Detailed product pages with images, variants, and reviews
- **Shopping Cart**: Persistent cart with quantity management and wishlist
- **Checkout Process**: Secure checkout with multiple payment options
- **User Authentication**: Sign up, login, and account management
- **Order Tracking**: Real-time order status and history
- **Responsive Design**: Mobile-first design across all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation

## 📋 Prerequisites

Before running this project, make sure you have:
- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account and project
- Git for version control

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/tausiful-islam/grok.git
cd grok
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_supabase_database_url

# Optional: For production deployment
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup
Your database is already configured and contains sample data. If you need to reset the database, contact the development team for the schema files.

### 4. Run Development Server
```bash
npm run dev
```

### 5. Access the Application
- **Main Store**: [http://localhost:3000](http://localhost:3000)

## � Product Management

For detailed instructions on adding and managing products, see the [Product Addition Guide](PRODUCT_GUIDE.md).

The system supports:
- **Simple Products**: Single price, no variants (e.g., Mouse, Coffee Mug)
- **Variable Products**: Multiple options with different prices (e.g., T-shirts with sizes/colors)

## �📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   │   ├── login/         # Login page
│   │   ├── signup/        # Registration page
│   │   └── ...
│   ├── (shop)/            # Customer-facing pages
│   │   ├── products/      # Product catalog and details
│   │   ├── cart/          # Shopping cart
│   │   ├── checkout/      # Checkout process
│   │   └── categories/    # Category pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Authentication components
│   ├── cart/             # Cart components
│   ├── checkout/         # Checkout components
│   ├── home/             # Homepage components
│   ├── layout/           # Layout components
│   └── product/          # Product components
├── lib/                  # Utility functions
│   ├── supabase/         # Supabase client and utilities
│   ├── utils.ts          # General utilities
│   └── validations/      # Form validation schemas
└── types/                # TypeScript type definitions
```

## � Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `DATABASE_URL` | Database connection string | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for admin operations | Production |
| `NEXT_PUBLIC_APP_URL` | Application URL | Optional |

### Database Schema

The database schema includes:
- **20+ tables** for comprehensive e-commerce functionality
- **Row Level Security (RLS)** policies for data protection
- **Triggers and functions** for automated operations
- **Indexes** for optimal performance

Key tables:
- `profiles` - User profiles and roles
- `products` - Product catalog with variants
- `orders` - Order management
- `categories` - Product categorization
- `cart_items` - Shopping cart functionality
- `admin_logs` - Admin activity tracking

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔐 User Access

The platform supports regular user registration and login. Users can:
- Create accounts and manage profiles
- Browse and purchase products
- Track their orders
- Manage their cart and wishlist

Product management is done through the Supabase dashboard or scripts as described in the [Product Addition Guide](PRODUCT_GUIDE.md).

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## �📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get product by ID

### Order Endpoints
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

## 🐛 Troubleshooting

### Common Issues

**Product Not Showing on Website:**
- Ensure `is_active` is set to `true`
- Check that the product has valid data
- Verify category exists if category_id is set

**Script Connection Issues:**
- Verify Supabase credentials in `.env.local`
- Check database URL format
- Ensure Supabase project is active

**Build Errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Next.js cache: `rm -rf .next`
- Check Node.js version compatibility

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database powered by [Supabase](https://supabase.com/)
- Deployed on [Vercel](https://vercel.com/)

---

Built with ❤️ using Next.js, Supabase, and Vercel
