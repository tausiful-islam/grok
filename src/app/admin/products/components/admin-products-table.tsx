'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Eye } from 'lucide-react'
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

interface Product {
  id: string
  name: string
  sku: string
  price: number
  salePrice: number | null
  stockQuantity: number
  isActive: boolean
  category: {
    name: string
  } | null
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    sku: 'WBH-001',
    price: 199.99,
    salePrice: 149.99,
    stockQuantity: 45,
    isActive: true,
    category: { name: 'Electronics' },
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    sku: 'SW-005',
    price: 299.99,
    salePrice: null,
    stockQuantity: 23,
    isActive: true,
    category: { name: 'Electronics' },
  },
  {
    id: '3',
    name: 'Gaming Mechanical Keyboard',
    sku: 'GMK-001',
    price: 129.99,
    salePrice: 99.99,
    stockQuantity: 12,
    isActive: true,
    category: { name: 'Gaming' },
  },
  {
    id: '4',
    name: 'Wireless Charging Pad',
    sku: 'WCP-001',
    price: 39.99,
    salePrice: null,
    stockQuantity: 67,
    isActive: true,
    category: { name: 'Accessories' },
  },
  {
    id: '5',
    name: 'Portable Power Bank',
    sku: 'PPB-002',
    price: 49.99,
    salePrice: 39.99,
    stockQuantity: 0,
    isActive: false,
    category: { name: 'Accessories' },
  },
]

export function AdminProductsTable() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Products ({filteredProducts.length})</CardTitle>
        <div className="flex space-x-2">
          <Input
            placeholder="Search products..."
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
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  {product.name}
                </TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>
                  {product.category?.name || 'Uncategorized'}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>{formatPrice(product.price)}</div>
                    {product.salePrice && (
                      <div className="text-sm text-muted-foreground">
                        Sale: {formatPrice(product.salePrice)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={product.stockQuantity > 10 ? 'default' : product.stockQuantity > 0 ? 'secondary' : 'destructive'}>
                    {product.stockQuantity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={product.isActive ? 'default' : 'secondary'}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/products/${product.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
