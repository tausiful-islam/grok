'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'

const categories = [
  { id: 'electronics', name: 'Electronics', count: 150 },
  { id: 'clothing', name: 'Clothing', count: 300 },
  { id: 'home', name: 'Home & Garden', count: 200 },
  { id: 'sports', name: 'Sports & Fitness', count: 120 },
  { id: 'books', name: 'Books', count: 500 },
  { id: 'beauty', name: 'Beauty & Personal Care', count: 180 }
]

const priceRanges = [
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: 'Over $200', min: 200, max: 1000 }
]

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category')?.split(',') || []
  )
  const [priceRange, setPriceRange] = useState([0, 1000])

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter(id => id !== categoryId)

    setSelectedCategories(newSelected)
    updateFilters({ category: newSelected.join(',') })
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    updateFilters({ minPrice: value[0], maxPrice: value[1] })
  }

  const updateFilters = (newParams: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === '' || value === 0) {
        params.delete(key)
      } else {
        params.set(key, value.toString())
      }
    })

    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 1000])
    router.push('/products')
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category.id, checked as boolean)
                }
              />
              <Label
                htmlFor={category.id}
                className="flex-1 text-sm cursor-pointer"
              >
                {category.name}
                <span className="text-muted-foreground ml-1">
                  ({category.count})
                </span>
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            {priceRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => handlePriceChange([range.min, range.max])}
                className="w-full text-left text-sm hover:text-primary transition-colors"
              >
                {range.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={clearFilters}
        className="w-full"
      >
        Clear All Filters
      </Button>
    </div>
  )
}
