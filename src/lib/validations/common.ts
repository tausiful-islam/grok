import { z } from 'zod'

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
})

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// Product validation schemas
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  basePrice: z.number().min(0, 'Price must be positive'),
  salePrice: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  categoryId: z.string().optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  weight: z.number().min(0).optional(),
  dimensions: z.object({
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0)
  }).optional(),
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  specifications: z.record(z.any()).default({}),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  hasVariants: z.boolean().default(false),
  stockQuantity: z.number().min(0).default(0),
  lowStockThreshold: z.number().min(0).default(5),
  trackInventory: z.boolean().default(true),
  allowBackorders: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).optional()
})

export const productVariantSchema = z.object({
  productId: z.string(),
  variantType: z.enum(['color', 'size', 'version', 'material', 'style']),
  variantName: z.string().min(1, 'Variant name is required'),
  variantValue: z.string().min(1, 'Variant value is required'),
  priceAdjustment: z.number().default(0),
  costPriceAdjustment: z.number().default(0),
  stockQuantity: z.number().min(0).default(0),
  skuSuffix: z.string().optional(),
  imageUrl: z.string().optional(),
  hexColor: z.string().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true)
})

// Order validation schemas
export const shippingAddressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required')
})

export const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    price: z.number().min(0, 'Price must be positive')
  })).min(1, 'Order must have at least one item'),
  shippingAddress: shippingAddressSchema,
  billingAddress: shippingAddressSchema.optional(),
  paymentMethod: z.enum(['cod', 'card', 'bank_transfer', 'digital_wallet']).default('cod'),
  notes: z.string().optional()
})

// Cart validation schemas
export const cartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1')
})

// User validation schemas
export const userProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional()
  }).optional(),
  avatarUrl: z.string().url().optional()
})

// Category validation schemas
export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Category slug is required'),
  description: z.string().optional(),
  parentId: z.string().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
})

// Review validation schemas
export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  title: z.string().min(1, 'Review title is required'),
  content: z.string().min(10, 'Review content must be at least 10 characters'),
  isVerifiedPurchase: z.boolean().default(false)
})

// Coupon validation schemas
export const couponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
  name: z.string().min(1, 'Coupon name is required'),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(0, 'Discount value must be positive'),
  minimumOrderAmount: z.number().min(0).default(0),
  maxDiscountAmount: z.number().min(0).optional(),
  usageLimit: z.number().min(1).optional(),
  isActive: z.boolean().default(true),
  validFrom: z.date().default(() => new Date()),
  validUntil: z.date().optional()
})

// Search validation schemas
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  sortBy: z.enum(['name', 'price', 'rating', 'newest', 'popular']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12)
})

// File upload validation schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  type: z.enum(['image', 'document']),
  maxSize: z.number().optional(),
  allowedTypes: z.array(z.string()).optional()
})

// API validation schemas
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
})

export const idSchema = z.object({
  id: z.string().uuid('Invalid ID format')
})

// Form validation helpers
export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: Record<string, string[]>
} {
  try {
    const validData = schema.parse(data)
    return { success: true, data: validData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      error.errors.forEach(err => {
        const path = err.path.join('.')
        if (!errors[path]) errors[path] = []
        errors[path].push(err.message)
      })
      return { success: false, errors }
    }
    return { success: false, errors: { general: ['Validation failed'] } }
  }
}
