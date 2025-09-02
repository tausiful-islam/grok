'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  user_id: string | null
  guest_name: string | null
  guest_email: string | null
  profiles?: {
    name: string
    email: string
  } | null
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'shipped':
      return 'bg-blue-100 text-blue-800'
    case 'pending':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentOrders()

    // Set up real-time subscription for new and updated orders
    const channel = supabase
      .channel('recent-orders-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'orders'
      }, () => {
        console.log('New order received, refreshing recent orders...')
        fetchRecentOrders()
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders'
      }, () => {
        console.log('Order status updated, refreshing recent orders...')
        fetchRecentOrders()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchRecentOrders = async () => {
    try {
      setLoading(true)

      // Fetch orders without join first (to handle guest orders and cases where join fails)
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          user_id,
          guest_name,
          guest_email
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error

      // For registered users, try to fetch their profile data separately
      const ordersWithProfiles = await Promise.all(
        (data || []).map(async (order: any) => {
          if (order.user_id) {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('name, email')
                .eq('id', order.user_id)
                .single()
              
              return {
                ...order,
                profiles: profile
              } as Order
            } catch {
              // If profile fetch fails, use order data as is
              return order as Order
            }
          }
          return order as Order
        })
      )

      setOrders(ordersWithProfiles)
    } catch (error) {
      console.error('Error fetching recent orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
                <div className="text-right space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
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
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No orders found
            </p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {order.profiles?.name || order.guest_name || 'Unknown Customer'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.profiles?.email || order.guest_email || 'No email'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">
                    ${order.total_amount.toFixed(2)}
                  </p>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-4">
          <Link
            href="/admin/orders"
            className="text-sm text-primary hover:underline"
          >
            View all orders →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
