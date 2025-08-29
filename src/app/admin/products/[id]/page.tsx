'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string
  name: string
  sku: string
  description: string
  price: number
  sale_price: number | null
  stock_quantity: number
  is_active: boolean
  categories: {
    name: string
  } | null
  created_at: string
  updated_at: string
}

export default function ProductViewPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          sku,
          description,
          price,
          sale_price,
          stock_quantity,
          is_active,
          created_at,
          updated_at,
          categories (
            name
          )
        `)
        .eq('id', productId)
        .single()

      if (error) throw error

      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Product not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">SKU: {product.sku}</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/products/${product.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1">{product.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">SKU</label>
              <p className="mt-1">{product.sku}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Category</label>
              <p className="mt-1">{product.categories?.name || 'Uncategorized'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="mt-1">{product.description || 'No description available'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Regular Price</label>
              <p className="mt-1 text-lg font-semibold">{formatPrice(product.price)}</p>
            </div>
            {product.sale_price && (
              <div>
                <label className="text-sm font-medium text-gray-700">Sale Price</label>
                <p className="mt-1 text-lg font-semibold text-green-600">{formatPrice(product.sale_price)}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
              <div className="mt-1 flex items-center space-x-2">
                <span>{product.stock_quantity}</span>
                <Badge variant={product.stock_quantity > 10 ? 'default' : product.stock_quantity > 0 ? 'secondary' : 'destructive'}>
                  {product.stock_quantity > 10 ? 'In Stock' : product.stock_quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="mt-1">
                <Badge variant={product.is_active ? 'default' : 'secondary'}>
                  {product.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timestamps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Created At</label>
            <p className="mt-1">{new Date(product.created_at).toLocaleString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Last Updated</label>
            <p className="mt-1">{new Date(product.updated_at).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
