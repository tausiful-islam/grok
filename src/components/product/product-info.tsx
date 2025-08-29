'use client'

import { useState } from 'react'
import { Star, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { VariantSelector } from '@/components/product/variant-selector'
import { QuantitySelector } from '@/components/product/quantity-selector'
import { AddToCartButton } from '@/components/product/add-to-cart-button'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'

interface ProductImage {
  id: string
  url: string
  alt_text: string
  is_primary: boolean
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  salePrice: number | null
  stockQuantity: number
  sku: string | null
  isActive: boolean
  isFeatured: boolean
  category: {
    id: string
    name: string
    slug: string
  } | null
  images: ProductImage[]
  createdAt: string
  updatedAt: string
}

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || '',
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="space-y-6">
      {/* Product Title and SKU */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>
        {product.sku && (
          <p className="text-sm text-muted-foreground">
            SKU: {product.sku}
          </p>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              )}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          (4.5) • 128 reviews
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center space-x-3">
        {product.salePrice ? (
          <>
            <span className="text-3xl font-bold text-primary">
              {formatPrice(product.salePrice)}
            </span>
            <span className="text-xl text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
            <Badge variant="destructive">
              -{discountPercentage}%
            </Badge>
          </>
        ) : (
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        <div className={cn(
          "w-2 h-2 rounded-full",
          product.stockQuantity > 10 ? "bg-green-500" :
          product.stockQuantity > 0 ? "bg-yellow-500" : "bg-red-500"
        )} />
        <span className="text-sm">
          {product.stockQuantity > 10 ? "In Stock" :
           product.stockQuantity > 0 ? `Only ${product.stockQuantity} left` :
           "Out of Stock"}
        </span>
      </div>

      <Separator />

      {/* Description */}
      {product.description && (
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {/* Variants */}
      <VariantSelector
        productId={product.id}
        onVariantChange={setSelectedVariant}
      />

      <Separator />

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Quantity</span>
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            max={product.stockQuantity}
          />
        </div>

        <AddToCartButton
          product={product}
          variantId={selectedVariant}
          quantity={quantity}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="flex-1"
        >
          <Heart className={cn(
            "mr-2 h-4 w-4",
            isWishlisted ? "fill-red-500 text-red-500" : ""
          )} />
          {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </Button>
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>

      <Separator />

      {/* Shipping & Returns */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3 text-sm">
          <Truck className="h-4 w-4 text-green-600" />
          <span>Free shipping on orders over $50</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <Shield className="h-4 w-4 text-blue-600" />
          <span>2-year warranty included</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <RotateCcw className="h-4 w-4 text-purple-600" />
          <span>30-day return policy</span>
        </div>
      </div>
    </div>
  )
}
