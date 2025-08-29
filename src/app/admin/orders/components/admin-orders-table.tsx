'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, Truck, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatPrice } from '@/lib/utils'

interface Order {
  id: string
  customerName: string
  customerEmail: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  date: string
  items: number
}

const mockOrders: Order[] = [
  {
    id: '#3210',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    total: 299.00,
    status: 'delivered',
    date: '2024-01-15',
    items: 2,
  },
  {
    id: '#3211',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    total: 149.99,
    status: 'shipped',
    date: '2024-01-15',
    items: 1,
  },
  {
    id: '#3212',
    customerName: 'Bob Johnson',
    customerEmail: 'bob@example.com',
    total: 79.50,
    status: 'processing',
    date: '2024-01-14',
    items: 1,
  },
  {
    id: '#3213',
    customerName: 'Alice Brown',
    customerEmail: 'alice@example.com',
    total: 199.99,
    status: 'pending',
    date: '2024-01-14',
    items: 3,
  },
  {
    id: '#3214',
    customerName: 'Charlie Wilson',
    customerEmail: 'charlie@example.com',
    total: 399.99,
    status: 'cancelled',
    date: '2024-01-13',
    items: 1,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'processing':
      return 'bg-blue-100 text-blue-800'
    case 'shipped':
      return 'bg-purple-100 text-purple-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />
    case 'processing':
      return <Clock className="h-4 w-4" />
    case 'shipped':
      return <Truck className="h-4 w-4" />
    case 'delivered':
      return <CheckCircle className="h-4 w-4" />
    case 'cancelled':
      return <Clock className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

export function AdminOrdersTable() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
        <div className="flex space-x-2">
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.id}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.customerEmail}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>{formatPrice(order.total)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    <span className="flex items-center space-x-1">
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
                  </Badge>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/orders/${order.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
