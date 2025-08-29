'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'

interface TopProduct {
  id: string
  name: string
  sales: number
  revenue: number
  growth: number
}

export function TopProducts() {
  const [products, setProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopProducts()
  }, [])

  const fetchTopProducts = async () => {
    try {
      setLoading(true)

      // Fetch product sales data from order_items
      const { data: orderItems, error } = await supabase
        .from('order_items')
        .select(`
          quantity,
          price,
          products (
            id,
            name
          )
        `)

      if (error) throw error

      // Aggregate sales data by product
      const productStats = new Map<string, { sales: number; revenue: number; name: string }>()

      orderItems?.forEach((item: any) => {
        const productId = item.products?.id
        const productName = item.products?.name

        if (productId && productName) {
          const existing = productStats.get(productId) || { sales: 0, revenue: 0, name: productName }

          productStats.set(productId, {
            sales: existing.sales + item.quantity,
            revenue: existing.revenue + (item.price * item.quantity),
            name: productName,
          })
        }
      })

      // Convert to array and sort by sales
      const topProductsArray = Array.from(productStats.entries())
        .map(([id, stats]) => ({
          id,
          name: stats.name,
          sales: stats.sales,
          revenue: stats.revenue,
          growth: Math.floor(Math.random() * 40) + 5, // Mock growth for now
        }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5)

      setProducts(topProductsArray)
    } catch (error) {
      console.error('Error fetching top products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded w-12 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No products found
            </p>
          ) : (
            products.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.sales} sales
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">
                    ${product.revenue.toFixed(2)}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    +{product.growth}%
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-4">
          <Link
            href="/admin/products"
            className="text-sm text-primary hover:underline"
          >
            View all products →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
