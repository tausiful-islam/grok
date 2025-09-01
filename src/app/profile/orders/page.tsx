'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, ShoppingBag, Truck, CheckCircle, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  created_at: string
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: OrderItem[]
}

export default function OrdersPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your orders</h1>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Mock orders data - in a real app, this would come from the database
  const orders: Order[] = [
    // This would be populated from the database
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track your purchases and order history</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">You haven't placed any orders yet. Start shopping to see your order history here.</p>
              <Link href="/products">
                <Button>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order: Order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <CardDescription>
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        order.status === 'delivered' ? 'default' :
                        order.status === 'shipped' ? 'secondary' :
                        order.status === 'processing' ? 'outline' : 'destructive'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {order.status === 'delivered' && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {order.status === 'shipped' && <Truck className="w-4 h-4 text-blue-500" />}
                        {order.status === 'processing' && <Clock className="w-4 h-4 text-yellow-500" />}
                        <span className="text-sm capitalize">{order.status}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total: ${order.total}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item: OrderItem, index: number) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{item.name} x {item.quantity}</span>
                            <span>${item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm">
                          Write Review
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
