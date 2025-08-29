'use client'

import { useState, useEffect } from 'react'
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
import { supabase } from '@/lib/supabase/client'

interface Profile {
  id: string
  full_name: string | null
  email: string
  phone: string | null
  address: string | null
  created_at: string
  role: string
}

interface Customer extends Profile {
  total_orders: number
  total_spent: number
  last_order_date: string | null
}

export function AdminCustomersTable() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)

      // First, get all profiles (customers)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profilesError) throw profilesError

      // Then, get order statistics for each customer
      const customersWithStats = await Promise.all(
        (profiles as Profile[] || []).map(async (profile: Profile) => {
          const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('total_amount, created_at')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })

          if (ordersError) {
            console.error('Error fetching orders for customer:', profile.id, ordersError)
            return {
              ...profile,
              total_orders: 0,
              total_spent: 0,
              last_order_date: null,
            } as Customer
          }

          const ordersData = orders as { total_amount: number; created_at: string }[] | null
          const totalOrders = ordersData?.length || 0
          const totalSpent = ordersData?.reduce((sum: number, order) => sum + order.total_amount, 0) || 0
          const lastOrderDate = ordersData?.[0]?.created_at || null

          return {
            ...profile,
            total_orders: totalOrders,
            total_spent: totalSpent,
            last_order_date: lastOrderDate,
          } as Customer
        })
      )

      setCustomers(customersWithStats)
    } catch (error) {
      console.error('Error fetching customers:', error)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusFromOrders = (totalOrders: number, lastOrderDate: string | null) => {
    if (totalOrders === 0) return 'inactive'
    if (!lastOrderDate) return 'inactive'

    const lastOrder = new Date(lastOrderDate)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    return lastOrder > thirtyDaysAgo ? 'active' : 'inactive'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Customers...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
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
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No customers found matching your search.' : 'No customers found.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => {
                const status = getStatusFromOrders(customer.total_orders, customer.last_order_date)

                return (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {customer.full_name || 'Unknown Customer'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Joined {new Date(customer.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span className="text-sm">{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span className="text-sm">{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.address ? (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span className="text-sm">{customer.address}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not provided</span>
                      )}
                    </TableCell>
                    <TableCell>{customer.total_orders}</TableCell>
                    <TableCell>${customer.total_spent.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {customer.last_order_date
                        ? new Date(customer.last_order_date).toLocaleDateString()
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/customers/${customer.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
