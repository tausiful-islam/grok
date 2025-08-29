'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Package,
  AlertTriangle,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Minus,
  RefreshCw,
  Download
} from 'lucide-react'

interface InventoryItem {
  id: string
  name: string
  sku: string
  stock_quantity: number
  low_stock_threshold: number
  category_name: string
  is_active: boolean
  last_updated: string
}

interface InventoryMovement {
  id: string
  product_name: string
  movement_type: string
  quantity: number
  reason: string
  created_by: string
  created_at: string
}

interface InventoryAlert {
  id: string
  product_name: string
  alert_type: string
  current_stock: number
  threshold: number
  created_at: string
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [alerts, setAlerts] = useState<InventoryAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchInventoryData()
  }, [])

  const fetchInventoryData = async () => {
    try {
      setLoading(true)
      // In a real app, these would be API calls to Supabase
      // For now, we'll use mock data
      setInventory([
        {
          id: '1',
          name: 'Wireless Headphones',
          sku: 'WH-001',
          stock_quantity: 3,
          low_stock_threshold: 5,
          category_name: 'Electronics',
          is_active: true,
          last_updated: '2025-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'Cotton T-Shirt',
          sku: 'TS-002',
          stock_quantity: 25,
          low_stock_threshold: 10,
          category_name: 'Clothing',
          is_active: true,
          last_updated: '2025-01-14T15:45:00Z'
        }
      ])

      setMovements([
        {
          id: '1',
          product_name: 'Wireless Headphones',
          movement_type: 'sale',
          quantity: -2,
          reason: 'Order #ORD-20250115-0001',
          created_by: 'System',
          created_at: '2025-01-15T09:15:00Z'
        }
      ])

      setAlerts([
        {
          id: '1',
          product_name: 'Wireless Headphones',
          alert_type: 'low_stock',
          current_stock: 3,
          threshold: 5,
          created_at: '2025-01-15T10:30:00Z'
        }
      ])
    } catch (error) {
      console.error('Error fetching inventory data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStock = async (productId: string, newQuantity: number, reason: string) => {
    try {
      // In a real app, this would be an API call to update inventory
      console.log(`Updating stock for product ${productId} to ${newQuantity}, reason: ${reason}`)
      await fetchInventoryData() // Refresh data
    } catch (error) {
      console.error('Error updating stock:', error)
    }
  }

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity === 0) return { status: 'out_of_stock', color: 'destructive' }
    if (quantity <= threshold) return { status: 'low_stock', color: 'warning' }
    return { status: 'in_stock', color: 'default' }
  }

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || item.category_name === selectedCategory)
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track and manage your product inventory</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventory.filter(item => item.stock_quantity <= item.low_stock_threshold).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Stock Value</p>
                <p className="text-2xl font-bold text-gray-900">$12,450</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventory.filter(item => item.stock_quantity === 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{alerts.length} inventory alert(s):</strong>
            {alerts.map(alert => (
              <div key={alert.id} className="mt-1">
                {alert.product_name} - {alert.alert_type.replace('_', ' ')} (Current: {alert.current_stock})
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inventory">Current Inventory</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
            </select>
          </div>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">SKU</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Stock</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item) => {
                      const stockStatus = getStockStatus(item.stock_quantity, item.low_stock_threshold)
                      return (
                        <tr key={item.id} className="border-b">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">Last updated: {new Date(item.last_updated).toLocaleDateString()}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">{item.sku}</td>
                          <td className="py-3 px-4">{item.category_name}</td>
                          <td className="py-3 px-4">
                            <span className={`font-medium ${
                              item.stock_quantity === 0 ? 'text-red-600' :
                              item.stock_quantity <= item.low_stock_threshold ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {item.stock_quantity}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={stockStatus.color as any}>
                              {stockStatus.status.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStock(item.id, item.stock_quantity + 1, 'Manual adjustment')}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStock(item.id, Math.max(0, item.stock_quantity - 1), 'Manual adjustment')}
                                disabled={item.stock_quantity === 0}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Movement</th>
                      <th className="text-left py-3 px-4">Quantity</th>
                      <th className="text-left py-3 px-4">Reason</th>
                      <th className="text-left py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.map((movement) => (
                      <tr key={movement.id} className="border-b">
                        <td className="py-3 px-4">{movement.product_name}</td>
                        <td className="py-3 px-4">
                          <Badge variant={movement.movement_type === 'sale' ? 'destructive' : 'default'}>
                            {movement.movement_type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className={movement.quantity < 0 ? 'text-red-600' : 'text-green-600'}>
                            {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                          </span>
                        </td>
                        <td className="py-3 px-4">{movement.reason}</td>
                        <td className="py-3 px-4">{new Date(movement.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <Alert key={alert.id}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{alert.product_name}</strong> - {alert.alert_type.replace('_', ' ')}
                      (Current stock: {alert.current_stock}, Threshold: {alert.threshold})
                      <br />
                      <small className="text-gray-500">
                        Alert created: {new Date(alert.created_at).toLocaleString()}
                      </small>
                    </AlertDescription>
                  </Alert>
                ))}
                {alerts.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No inventory alerts at this time.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
