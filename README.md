# E-Commerce Platform

A modern, full-featured e-commerce platform built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Features a complete admin panel for store management and a responsive customer-facing storefront.

## 🚀 Features

### Customer Features
- **Product Catalog**: Browse products by categories
- **Product Details**: Detailed product pages with images and descriptions
- **Shopping Cart**: Add/remove items with quantity management
- **Checkout Process**: Complete checkout flow with order confirmation
- **Responsive Design**: Mobile-friendly across all devices

### Admin Panel
- **Dashboard**: Sales analytics, recent orders, and key metrics
- **Product Management**: CRUD operations for products
- **Order Management**: Track and manage customer orders
- **Customer Management**: View and manage customer data
- **Category Management**: Organize products by categories
- **Store Settings**: Configure payment, shipping, and email settings

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Icons**: Lucide React

##  Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Main site: [http://localhost:3000](http://localhost:3000)
   - Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (shop)/            # Customer-facing pages
│   │   ├── products/      # Product pages
│   │   ├── cart/          # Shopping cart
│   │   ├── checkout/      # Checkout process
│   │   └── ...
│   ├── admin/             # Admin panel
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── products/      # Product management
│   │   ├── orders/        # Order management
│   │   ├── customers/     # Customer management
│   │   ├── categories/    # Category management
│   │   └── settings/      # Store settings
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── admin/            # Admin-specific components
│   └── ...
├── lib/                  # Utility functions
└── types/                # TypeScript types
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js, Supabase, and Vercel
