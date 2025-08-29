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

      // Get current date and calculate periods
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

      // Fetch current period order items
      const { data: currentOrderItems, error: currentError } = await supabase
        .from('order_items')
        .select(`
          quantity,
          price,
          created_at,
          products (
            id,
            name
          )
        `)
        .gte('created_at', thirtyDaysAgo.toISOString())

      if (currentError) throw currentError

      // Fetch previous period order items
      const { data: previousOrderItems, error: previousError } = await supabase
        .from('order_items')
        .select(`
          quantity,
          price,
          created_at,
          products (
            id,
            name
          )
        `)
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString())

      if (previousError) throw previousError

      // Aggregate current period sales data by product
      const currentProductStats = new Map<string, { sales: number; revenue: number; name: string }>()
      currentOrderItems?.forEach((item: any) => {
        const productId = item.products?.id
        const productName = item.products?.name

        if (productId && productName) {
          const existing = currentProductStats.get(productId) || { sales: 0, revenue: 0, name: productName }

          currentProductStats.set(productId, {
            sales: existing.sales + item.quantity,
            revenue: existing.revenue + (item.price * item.quantity),
            name: productName,
          })
        }
      })

      // Aggregate previous period sales data by product
      const previousProductStats = new Map<string, { sales: number; revenue: number }>()
      previousOrderItems?.forEach((item: any) => {
        const productId = item.products?.id

        if (productId) {
          const existing = previousProductStats.get(productId) || { sales: 0, revenue: 0 }

          previousProductStats.set(productId, {
            sales: existing.sales + item.quantity,
            revenue: existing.revenue + (item.price * item.quantity),
          })
        }
      })

      // Calculate growth and create final array
      const topProductsArray = Array.from(currentProductStats.entries())
        .map(([id, currentStats]) => {
          const previousStats = previousProductStats.get(id)
          const previousSales = previousStats?.sales || 0

          // Calculate growth percentage
          const growth = previousSales > 0
            ? ((currentStats.sales - previousSales) / previousSales) * 100
            : currentStats.sales > 0 ? 100 : 0 // 100% growth if new product with sales

          return {
            id,
            name: currentStats.name,
            sales: currentStats.sales,
            revenue: currentStats.revenue,
            growth: Math.round(growth * 10) / 10, // Round to 1 decimal place
          }
        })
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
