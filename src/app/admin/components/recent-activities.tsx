'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, User, ShoppingCart, Package, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface Activity {
  id: string
  type: 'order' | 'user' | 'product' | 'admin'
  title: string
  description: string
  timestamp: string
  user?: string
  status?: 'success' | 'warning' | 'error'
}

export function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentActivities()
  }, [])

  const fetchRecentActivities = async () => {
    try {
      setLoading(true)

      // Fetch recent orders
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          total_amount,
          created_at,
          user_id,
          profiles:profiles(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch recent user registrations
      const { data: users } = await supabase
        .from('profiles')
        .select('id, name, created_at, role')
        .order('created_at', { ascending: false })
        .limit(3)

      // Fetch recent product additions
      const { data: products } = await supabase
        .from('products')
        .select('id, name, created_at, status')
        .order('created_at', { ascending: false })
        .limit(3)

      const activityList: Activity[] = []

      // Add order activities
      orders?.forEach((order: any) => {
        activityList.push({
          id: `order-${order.id}`,
          type: 'order',
          title: `New Order #${order.order_number}`,
          description: `$${order.total_amount} by ${order.profiles?.name || 'Customer'}`,
          timestamp: order.created_at,
          status: order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'error' : 'warning'
        })
      })

      // Add user activities
      users?.forEach((user: any) => {
        activityList.push({
          id: `user-${user.id}`,
          type: 'user',
          title: 'New User Registration',
          description: `${user.name || 'User'} joined as ${user.role}`,
          timestamp: user.created_at,
          status: 'success'
        })
      })

      // Add product activities
      products?.forEach((product: any) => {
        activityList.push({
          id: `product-${product.id}`,
          type: 'product',
          title: 'New Product Added',
          description: product.name,
          timestamp: product.created_at,
          status: product.status === 'active' ? 'success' : 'warning'
        })
      })

      // Sort by timestamp
      activityList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setActivities(activityList.slice(0, 8))
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="h-4 w-4" />
      case 'user':
        return <User className="h-4 w-4" />
      case 'product':
        return <Package className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No recent activities
          </p>
        )}
      </CardContent>
    </Card>
  )
}
