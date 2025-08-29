'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, Mail, Phone, MapPin } from 'lucide-react'
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

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  location: string
  totalOrders: number
  totalSpent: number
  lastOrder: string
  status: 'active' | 'inactive'
  joinDate: string
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    totalOrders: 12,
    totalSpent: 1249.99,
    lastOrder: '2024-01-15',
    status: 'active',
    joinDate: '2023-06-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 987-6543',
    location: 'Los Angeles, CA',
    totalOrders: 8,
    totalSpent: 899.99,
    lastOrder: '2024-01-10',
    status: 'active',
    joinDate: '2023-08-22',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1 (555) 456-7890',
    location: 'Chicago, IL',
    totalOrders: 5,
    totalSpent: 599.99,
    lastOrder: '2023-12-20',
    status: 'inactive',
    joinDate: '2023-09-10',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    phone: '+1 (555) 321-0987',
    location: 'Houston, TX',
    totalOrders: 15,
    totalSpent: 1599.99,
    lastOrder: '2024-01-12',
    status: 'active',
    joinDate: '2023-05-03',
  },
]

export function AdminCustomersTable() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Customers ({filteredCustomers.length})</CardTitle>
        <div className="flex space-x-2">
          <Input
            placeholder="Search customers..."
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
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Joined {customer.joinDate}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span className="text-sm">{customer.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span className="text-sm">{customer.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span className="text-sm">{customer.location}</span>
                  </div>
                </TableCell>
                <TableCell>{customer.totalOrders}</TableCell>
                <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>{customer.lastOrder}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/customers/${customer.id}`}>
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
