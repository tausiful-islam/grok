'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  salePrice: number | null
  images: Array<{
    id: string
    url: string
    alt_text: string
    is_primary: boolean
  }>
  category: {
    id: string
    name: string
    slug: string
  } | null
}

interface SearchPageProps {
  searchParams: {
    q?: string
    category?: string
    sortBy?: string
    sortOrder?: string
    page?: string
  }
}

export function SearchResults({ searchParams }: SearchPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.q || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || '')
  const [sortBy, setSortBy] = useState(searchParams.sortBy || 'name')
  const [sortOrder, setSortOrder] = useState(searchParams.sortOrder || 'asc')

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true)
      try {
        // Mock search results - replace with actual API
        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Wireless Headphones',
            slug: 'wireless-headphones',
            price: 199.99,
            salePrice: 149.99,
            images: [{
              id: '1',
              url: '/images/placeholder-product.svg',
              alt_text: 'Wireless Headphones',
              is_primary: true
            }],
            category: {
              id: '1',
              name: 'Electronics',
              slug: 'electronics'
            }
          },
          {
            id: '2',
            name: 'Bluetooth Speaker',
            slug: 'bluetooth-speaker',
            price: 89.99,
            salePrice: null,
            images: [{
              id: '2',
              url: '/images/placeholder-product.svg',
              alt_text: 'Bluetooth Speaker',
              is_primary: true
            }],
            category: {
              id: '1',
              name: 'Electronics',
              slug: 'electronics'
            }
          },
          {
            id: '3',
            name: 'Smart Watch',
            slug: 'smart-watch',
            price: 299.99,
            salePrice: 249.99,
            images: [{
              id: '3',
              url: '/images/placeholder-product.svg',
              alt_text: 'Smart Watch',
              is_primary: true
            }],
            category: {
              id: '1',
              name: 'Electronics',
              slug: 'electronics'
            }
          }
        ]

        // Filter products based on search query and category
        let filteredProducts = mockProducts

        if (searchQuery) {
          filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }

        if (selectedCategory) {
          filteredProducts = filteredProducts.filter(product =>
            product.category?.slug === selectedCategory
          )
        }

        // Sort products
        filteredProducts.sort((a, b) => {
          let aValue: any = a[sortBy as keyof Product]
          let bValue: any = b[sortBy as keyof Product]

          if (sortBy === 'price') {
            aValue = a.salePrice || a.price
            bValue = b.salePrice || b.price
          }

          if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1
          } else {
            return aValue < bValue ? 1 : -1
          }
        })

        setProducts(filteredProducts)
      } catch (error) {
        console.error('Error fetching search results:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [searchQuery, selectedCategory, sortBy, sortOrder])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Update URL with search parameters
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCategory) params.set('category', selectedCategory)
    if (sortBy !== 'name') params.set('sortBy', sortBy)
    if (sortOrder !== 'asc') params.set('sortOrder', sortOrder)

    window.history.replaceState(null, '', `?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="created_at">Newest</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Asc</SelectItem>
                    <SelectItem value="desc">Desc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search terms or browse our categories
          </p>
          <Button asChild>
            <Link href="/products">Browse All Products</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              Found {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const primaryImage = product.images.find(img => img.is_primary) || product.images[0]
              const discountPercentage = product.salePrice
                ? Math.round(((product.price - product.salePrice) / product.price) * 100)
                : 0

              return (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                      <Link href={`/products/${product.slug}`}>
                        <Image
                          src={primaryImage?.url || '/images/placeholder-product.svg'}
                          alt={primaryImage?.alt_text || product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </Link>
                      {product.salePrice && (
                        <Badge className="absolute top-2 left-2" variant="destructive">
                          -{discountPercentage}%
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-medium line-clamp-2 hover:text-primary transition-colors"
                      >
                        {product.name}
                      </Link>

                      <div className="flex items-center space-x-2">
                        {product.category && (
                          <Badge variant="secondary" className="text-xs">
                            {product.category.name}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {product.salePrice ? (
                          <>
                            <span className="font-bold text-primary">
                              {formatPrice(product.salePrice)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
