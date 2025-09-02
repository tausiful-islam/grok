'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus, 
  Users, 
  Package, 
  ShoppingCart, 
  Settings, 
  BarChart3,
  FileText,
  UserPlus
} from 'lucide-react'

export function QuickActions() {
  const actions = [
    {
      title: 'Add Product',
      description: 'Add a new product to inventory',
      href: '/admin/products/new',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'View Orders',
      description: 'Manage customer orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Add User',
      description: 'Create new admin user',
      href: '/admin/users/new',
      icon: UserPlus,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Analytics',
      description: 'View detailed analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50 border-dashed"
              >
                <div className={`p-2 rounded-lg text-white ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
