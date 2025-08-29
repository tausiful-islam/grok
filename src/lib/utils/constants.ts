// App constants
export const APP_NAME = 'E-Commerce Platform'
export const APP_DESCRIPTION = 'Modern e-commerce platform with advanced features'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Supabase
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Pagination
export const ITEMS_PER_PAGE = 12
export const MAX_ITEMS_PER_PAGE = 100

// Product
export const MAX_PRODUCT_IMAGES = 10
export const MAX_VARIANT_IMAGES = 5
export const DEFAULT_LOW_STOCK_THRESHOLD = 5

// Cart
export const MAX_CART_ITEMS = 50
export const CART_EXPIRY_DAYS = 30

// Orders
export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
] as const

export const PAYMENT_METHODS = [
  'cod',
  'card',
  'bank_transfer',
  'digital_wallet'
] as const

// User roles
export const USER_ROLES = [
  'customer',
  'admin',
  'super_admin'
] as const

// Product categories
export const PRODUCT_CATEGORIES = [
  'electronics',
  'clothing',
  'home',
  'sports',
  'books',
  'beauty',
  'automotive',
  'other'
] as const

// File upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
]

// Analytics
export const ANALYTICS_DATE_RANGES = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Last year', value: '1y' }
] as const

// Shipping
export const SHIPPING_METHODS = [
  { id: 'standard', name: 'Standard Shipping', cost: 50, days: '3-5' },
  { id: 'express', name: 'Express Shipping', cost: 100, days: '1-2' },
  { id: 'overnight', name: 'Overnight', cost: 200, days: '1' }
] as const

// Tax
export const TAX_RATE = 0.15 // 15%

// Currency
export const DEFAULT_CURRENCY = 'BDT'
export const CURRENCY_SYMBOLS = {
  BDT: '৳',
  USD: '$',
  EUR: '€',
  GBP: '£'
} as const

// SEO
export const DEFAULT_SEO_TITLE = 'E-Commerce Platform - Shop with Confidence'
export const DEFAULT_SEO_DESCRIPTION = 'Discover amazing products at great prices. Fast shipping, secure payments, and excellent customer service.'

// Social media
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com',
  twitter: 'https://twitter.com',
  instagram: 'https://instagram.com',
  linkedin: 'https://linkedin.com'
} as const

// Contact
export const CONTACT_INFO = {
  email: 'support@example.com',
  phone: '+880 123 456 7890',
  address: 'Dhaka, Bangladesh'
} as const

// API
export const API_ROUTES = {
  products: '/api/products',
  orders: '/api/orders',
  cart: '/api/cart',
  auth: '/api/auth',
  upload: '/api/upload',
  analytics: '/api/analytics'
} as const

// Cache
export const CACHE_TTL = {
  products: 300, // 5 minutes
  categories: 3600, // 1 hour
  user: 1800, // 30 minutes
  analytics: 600 // 10 minutes
} as const
