'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'

interface ProductFormData {
  name: string
  description: string
  shortDescription: string
  basePrice: string
  salePrice: string
  costPrice: string
  sku: string
  barcode: string
  categoryId: string
  brand: string
  weight: string
  stockQuantity: string
  lowStockThreshold: string
  isActive: boolean
  isFeatured: boolean
  trackInventory: boolean
  allowBackorders: boolean
  seoTitle: string
  seoDescription: string
  seoKeywords: string
}

export function ProductForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    shortDescription: '',
    basePrice: '',
    salePrice: '',
    costPrice: '',
    sku: '',
    barcode: '',
    categoryId: '',
    brand: '',
    weight: '',
    stockQuantity: '',
    lowStockThreshold: '5',
    isActive: true,
    isFeatured: false,
    trackInventory: true,
    allowBackorders: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  })

    // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .eq('is_active', true)
          .order('name')

        if (error) throw error
        setCategories(data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        short_description: formData.shortDescription,
        base_price: parseFloat(formData.basePrice),
        sale_price: formData.salePrice ? parseFloat(formData.salePrice) : null,
        cost_price: formData.costPrice ? parseFloat(formData.costPrice) : null,
        sku: formData.sku,
        barcode: formData.barcode,
        category_id: formData.categoryId || null,
        brand: formData.brand,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        stock_quantity: parseInt(formData.stockQuantity),
        low_stock_threshold: parseInt(formData.lowStockThreshold),
        is_active: formData.isActive,
        is_featured: formData.isFeatured,
        track_inventory: formData.trackInventory,
        allow_backorders: formData.allowBackorders,
        seo_title: formData.seoTitle,
        seo_description: formData.seoDescription,
        seo_keywords: formData.seoKeywords ? formData.seoKeywords.split(',').map(k => k.trim()) : [],
      }

      const { data, error } = await (supabase as any)
        .from('products')
        .insert(productData)
        .select()
        .single()

      if (error) throw error

      router.push('/admin/products')
    } catch (error: any) {
      console.error('Error creating product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleChange('sku', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => handleChange('shortDescription', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={5}
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price *</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) => handleChange('basePrice', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salePrice">Sale Price</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                value={formData.salePrice}
                onChange={(e) => handleChange('salePrice', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => handleChange('costPrice', e.target.value)}
              />
            </div>
          </div>

          {/* Category and Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select value={formData.categoryId} onValueChange={(value) => handleChange('categoryId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
              />
            </div>
          </div>

          {/* Inventory */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity *</Label>
              <Input
                id="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => handleChange('stockQuantity', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                value={formData.lowStockThreshold}
                onChange={(e) => handleChange('lowStockThreshold', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
              />
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => handleChange('barcode', e.target.value)}
              />
            </div>
          </div>

          {/* SEO Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">SEO Settings</h3>

            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => handleChange('seoTitle', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => handleChange('seoDescription', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoKeywords">SEO Keywords (comma-separated)</Label>
              <Input
                id="seoKeywords"
                value={formData.seoKeywords}
                onChange={(e) => handleChange('seoKeywords', e.target.value)}
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange('isActive', checked)}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleChange('isFeatured', checked)}
                />
                <Label htmlFor="isFeatured">Featured Product</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="trackInventory"
                  checked={formData.trackInventory}
                  onCheckedChange={(checked) => handleChange('trackInventory', checked)}
                />
                <Label htmlFor="trackInventory">Track Inventory</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="allowBackorders"
                  checked={formData.allowBackorders}
                  onCheckedChange={(checked) => handleChange('allowBackorders', checked)}
                />
                <Label htmlFor="allowBackorders">Allow Backorders</Label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
