'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatPrice } from '@/lib/utils'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  salePrice: number | null
  images: Array<{
    id: string
    url: string
    alt_text: string
    is_primary: boolean
  }>
  category: {
    id: string
    name: string
    slug: string
  } | null
}

interface RelatedProductsProps {
  currentProductId: string
  categoryId?: string
  limit?: number
}

export function RelatedProducts({
  currentProductId,
  categoryId,
  limit = 4
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // Mock API call - replace with actual API
        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Wireless Headphones',
            slug: 'wireless-headphones',
            price: 199.99,
            salePrice: 149.99,
            images: [{
              id: '1',
              url: '/images/placeholder-product.svg',
              alt_text: 'Wireless Headphones',
              is_primary: true
            }],
            category: {
              id: '1',
              name: 'Electronics',
              slug: 'electronics'
            }
          },
          {
            id: '2',
            name: 'Bluetooth Speaker',
            slug: 'bluetooth-speaker',
            price: 89.99,
            salePrice: null,
            images: [{
              id: '2',
              url: '/images/placeholder-product.svg',
              alt_text: 'Bluetooth Speaker',
              is_primary: true
            }],
            category: {
              id: '1',
              name: 'Electronics',
              slug: 'electronics'
            }
          },
          {
            id: '3',
            name: 'Smart Watch',
            slug: 'smart-watch',
            price: 299.99,
            salePrice: 249.99,
            images: [{
              id: '3',
              url: '/images/placeholder-product.svg',
              alt_text: 'Smart Watch',
              is_primary: true
            }],
            category: {
              id: '1',
              name: 'Electronics',
              slug: 'electronics'
            }
          },
          {
            id: '4',
            name: 'Gaming Mouse',
            slug: 'gaming-mouse',
            price: 79.99,
            salePrice: null,
            images: [{
              id: '4',
              url: '/images/placeholder-product.svg',
              alt_text: 'Gaming Mouse',
              is_primary: true
            }],
            category: {
              id: '1',
              name: 'Electronics',
              slug: 'electronics'
            }
          }
        ]

        // Filter out current product and limit results
        const filteredProducts = mockProducts
          .filter(product => product.id !== currentProductId)
          .slice(0, limit)

        setProducts(filteredProducts)
      } catch (error) {
        console.error('Error fetching related products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [currentProductId, categoryId, limit])

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(limit)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Related Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const primaryImage = product.images.find(img => img.is_primary) || product.images[0]
          const discountPercentage = product.salePrice
            ? Math.round(((product.price - product.salePrice) / product.price) * 100)
            : 0

          return (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                  <Link href={`/products/${product.slug}`}>
                    <Image
                      src={primaryImage?.url || '/images/placeholder-product.svg'}
                      alt={primaryImage?.alt_text || product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </Link>
                  {product.salePrice && (
                    <Badge className="absolute top-2 left-2" variant="destructive">
                      -{discountPercentage}%
                    </Badge>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-medium line-clamp-2 hover:text-primary transition-colors"
                  >
                    {product.name}
                  </Link>

                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3 w-3",
                          i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        )}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">(4.2)</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {product.salePrice ? (
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
        })}
      </div>
    </div>
  )
}
