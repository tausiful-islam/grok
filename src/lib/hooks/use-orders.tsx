'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from './use-auth'

interface OrderItem {
  id: string
  product_id: string
  variant_id?: string
  product_name: string
  variant_details?: any
  quantity: number
  unit_price: number
  total_price: number
}

interface Order {
  id: string
  order_number: string
  user_id: string
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  total_amount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  payment_method: string
  payment_status: string
  currency: string
  shipping_address: any
  billing_address?: any
  shipping_method?: string
  tracking_number?: string
  notes?: string
  cancelled_reason?: string
  cancelled_at?: string
  shipped_at?: string
  delivered_at?: string
  created_at: string
  updated_at: string
  order_items: OrderItem[]
}

interface OrdersContextType {
  orders: Order[]
  loading: boolean
  totalOrders: number
  totalSpent: number
  fetchOrders: () => Promise<void>
  getOrderById: (orderId: string) => Order | null
  createOrder: (orderData: any) => Promise<{ order: Order | null; error: any }>
  updateOrderStatus: (orderId: string, status: string) => Promise<{ error: any }>
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchOrders = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            variant_id,
            product_name,
            variant_details,
            quantity,
            unit_price,
            total_price
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching orders:', error)
      } else {
        setOrders(data || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchOrders()
    } else {
      setOrders([])
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const getOrderById = (orderId: string): Order | null => {
    return orders.find(order => order.id === orderId) || null
  }

  const createOrder = async (orderData: any): Promise<{ order: Order | null; error: any }> => {
    if (!user) {
      return { order: null, error: { message: 'User not authenticated' } }
    }

    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: user.id,
          ...orderData
        } as any)
        .select()
        .single()

      if (orderError) {
        return { order: null, error: orderError }
      }

      // Create order items if provided
      if (orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map((item: any) => ({
          order_id: (order as any).id,
          product_id: item.product_id,
          variant_id: item.variant_id || null,
          product_name: item.product_name,
          variant_details: item.variant_details || null,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price
        }))

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems as any)

        if (itemsError) {
          console.error('Error creating order items:', itemsError)
        }
      }

      // Remove the profile update for now
      // We'll handle this with a trigger in the database

      // Refresh orders
      await fetchOrders()

      return { order, error: null }
    } catch (error) {
      return { order: null, error }
    }
  }

  const updateOrderStatus = async (orderId: string, status: string): Promise<{ error: any }> => {
    try {
      // For now, we'll just track this locally
      // In a real app, only admins should be able to update order status
      console.log('Order status update requested:', orderId, status)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const totalOrders = orders.length
  const totalSpent = orders
    .filter(order => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total_amount, 0)

  const value = {
    orders,
    loading,
    totalOrders,
    totalSpent,
    fetchOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
  }

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider')
  }
  return context
}
