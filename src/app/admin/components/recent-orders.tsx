import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const recentOrders = [
  {
    id: '#3210',
    customer: 'John Doe',
    email: 'john@example.com',
    total: '$299.00',
    status: 'completed',
    date: '2024-01-15',
  },
  {
    id: '#3211',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    total: '$149.99',
    status: 'processing',
    date: '2024-01-15',
  },
  {
    id: '#3212',
    customer: 'Bob Johnson',
    email: 'bob@example.com',
    total: '$79.50',
    status: 'shipped',
    date: '2024-01-14',
  },
  {
    id: '#3213',
    customer: 'Alice Brown',
    email: 'alice@example.com',
    total: '$199.99',
    status: 'pending',
    date: '2024-01-14',
  },
]

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{order.customer}</p>
                <p className="text-xs text-muted-foreground">{order.email}</p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-medium">{order.total}</p>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
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
