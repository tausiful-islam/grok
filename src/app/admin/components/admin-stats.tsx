'use client'

import { useEffect, useState } from 'react'
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'

interface StatsData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  revenueGrowth: number
  ordersGrowth: number
  customersGrowth: number
  productsGrowth: number
}

export function AdminStats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)

      // Fetch orders data
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount, created_at, user_id')

      if (ordersError) throw ordersError

      // Fetch products data
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, created_at')

      if (productsError) throw productsError

      // Fetch customers data
      const { data: customers, error: customersError } = await supabase
        .from('profiles')
        .select('id, created_at')

      if (customersError) throw customersError

      // Calculate current period (last 30 days)
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

      // Current period data
      const currentOrders = (orders || []).filter((order: any) =>
        new Date(order.created_at) >= thirtyDaysAgo
      )

      const currentProducts = (products || []).filter((product: any) =>
        new Date(product.created_at) >= thirtyDaysAgo
      )

      const currentCustomers = (customers || []).filter((customer: any) =>
        new Date(customer.created_at) >= thirtyDaysAgo
      )

      // Previous period data
      const previousOrders = (orders || []).filter((order: any) =>
        new Date(order.created_at) >= sixtyDaysAgo &&
        new Date(order.created_at) < thirtyDaysAgo
      )

      const previousProducts = (products || []).filter((product: any) =>
        new Date(product.created_at) >= sixtyDaysAgo &&
        new Date(product.created_at) < thirtyDaysAgo
      )

      const previousCustomers = (customers || []).filter((customer: any) =>
        new Date(customer.created_at) >= sixtyDaysAgo &&
        new Date(customer.created_at) < thirtyDaysAgo
      )

      // Calculate totals and growth
      const totalRevenue = currentOrders.reduce((sum: number, order: any) => sum + order.total_amount, 0)
      const totalOrders = currentOrders.length
      const totalProducts = products?.length || 0
      const totalCustomers = customers?.length || 0

      const previousRevenue = previousOrders.reduce((sum: number, order: any) => sum + order.total_amount, 0)
      const previousOrdersCount = previousOrders.length
      const previousProductsCount = previousProducts.length
      const previousCustomersCount = previousCustomers.length

      // Calculate growth percentages
      const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0
      const ordersGrowth = previousOrdersCount > 0 ? ((totalOrders - previousOrdersCount) / previousOrdersCount) * 100 : 0
      const customersGrowth = previousCustomersCount > 0 ? ((totalCustomers - previousCustomersCount) / previousCustomersCount) * 100 : 0
      const productsGrowth = previousProductsCount > 0 ? ((totalProducts - previousProductsCount) / previousProductsCount) * 100 : 0

      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        revenueGrowth,
        ordersGrowth,
        customersGrowth,
        productsGrowth,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Set default values if there's an error
      setStats({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        revenueGrowth: 0,
        ordersGrowth: 0,
        customersGrowth: 0,
        productsGrowth: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const statItems = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: `${stats.revenueGrowth >= 0 ? '+' : ''}${stats.revenueGrowth.toFixed(1)}%`,
      changeType: stats.revenueGrowth >= 0 ? 'positive' : 'negative',
      icon: DollarSign,
    },
    {
      title: 'Orders',
      value: stats.totalOrders.toLocaleString(),
      change: `${stats.ordersGrowth >= 0 ? '+' : ''}${stats.ordersGrowth.toFixed(1)}%`,
      changeType: stats.ordersGrowth >= 0 ? 'positive' : 'negative',
      icon: ShoppingCart,
    },
    {
      title: 'Customers',
      value: stats.totalCustomers.toLocaleString(),
      change: `${stats.customersGrowth >= 0 ? '+' : ''}${stats.customersGrowth.toFixed(1)}%`,
      changeType: stats.customersGrowth >= 0 ? 'positive' : 'negative',
      icon: Users,
    },
    {
      title: 'Products',
      value: stats.totalProducts.toLocaleString(),
      change: `${stats.productsGrowth >= 0 ? '+' : ''}${stats.productsGrowth.toFixed(1)}%`,
      changeType: stats.productsGrowth >= 0 ? 'positive' : 'negative',
      icon: Package,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                {stat.change}
              </span>
              {' '}from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
