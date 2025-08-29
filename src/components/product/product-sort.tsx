'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const sortOptions = [
  { value: 'created_at-desc', label: 'Newest First' },
  { value: 'created_at-asc', label: 'Oldest First' },
  { value: 'base_price-asc', label: 'Price: Low to High' },
  { value: 'base_price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'rating_average-desc', label: 'Highest Rated' },
  { value: 'sales_count-desc', label: 'Best Selling' }
]

export function ProductSort() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSort = `${searchParams.get('sortBy') || 'created_at'}-${searchParams.get('sortOrder') || 'desc'}`

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-')
    const params = new URLSearchParams(searchParams.toString())

    params.set('sortBy', sortBy)
    params.set('sortOrder', sortOrder)
    params.set('page', '1') // Reset to first page when sorting

    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
