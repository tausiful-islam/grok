'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils/format'

interface ProductCardProps {
  product: {
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
    images: {
      id: string
      url: string
      alt_text: string
      is_primary: boolean
    }[]
    createdAt: string
    updatedAt: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  // Get the primary image or first image
  const primaryImage = product.images.find(img => img.is_primary) || product.images[0]
  const imageUrl = primaryImage?.url || '/images/placeholder-product.svg'

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <CardContent className="p-0">
        <Link href={`/products/${product.slug}`}>
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={imageUrl}
              alt={primaryImage?.alt_text || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Sale Badge */}
            {product.salePrice && product.salePrice < product.price && (
              <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                -{discountPercentage}%
              </Badge>
            )}

            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.preventDefault()
                // Handle wishlist toggle
                console.log('Toggle wishlist for product:', product.id)
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </Link>

        <div className="p-4">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating - Placeholder for now since API doesn't provide this */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              (0)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            {product.salePrice && product.salePrice < product.price ? (
              <>
                <span className="font-bold text-primary">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-bold">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
