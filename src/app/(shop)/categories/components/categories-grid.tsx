'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Package, Smartphone, Shirt, Home, Car, Gamepad2, Heart, Dumbbell } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  productCount: number
  icon: string
}

const categoryIcons: Record<string, any> = {
  electronics: Smartphone,
  clothing: Shirt,
  home: Home,
  automotive: Car,
  gaming: Gamepad2,
  health: Heart,
  sports: Dumbbell,
  default: Package,
}

export function CategoriesGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Mock categories data - replace with actual API
        const mockCategories: Category[] = [
          {
            id: '1',
            name: 'Electronics',
            slug: 'electronics',
            description: 'Latest gadgets and electronic devices',
            image: '/images/categories/electronics.jpg',
            productCount: 245,
            icon: 'electronics'
          },
          {
            id: '2',
            name: 'Clothing',
            slug: 'clothing',
            description: 'Fashion and apparel for all styles',
            image: '/images/categories/clothing.jpg',
            productCount: 189,
            icon: 'clothing'
          },
          {
            id: '3',
            name: 'Home & Garden',
            slug: 'home-garden',
            description: 'Everything for your home and garden',
            image: '/images/categories/home.jpg',
            productCount: 156,
            icon: 'home'
          },
          {
            id: '4',
            name: 'Sports & Fitness',
            slug: 'sports-fitness',
            description: 'Gear for your active lifestyle',
            image: '/images/categories/sports.jpg',
            productCount: 98,
            icon: 'sports'
          },
          {
            id: '5',
            name: 'Automotive',
            slug: 'automotive',
            description: 'Car parts and accessories',
            image: '/images/categories/automotive.jpg',
            productCount: 76,
            icon: 'automotive'
          },
          {
            id: '6',
            name: 'Gaming',
            slug: 'gaming',
            description: 'Gaming consoles and accessories',
            image: '/images/categories/gaming.jpg',
            productCount: 134,
            icon: 'gaming'
          },
          {
            id: '7',
            name: 'Health & Beauty',
            slug: 'health-beauty',
            description: 'Health and beauty products',
            image: '/images/categories/health.jpg',
            productCount: 87,
            icon: 'health'
          },
          {
            id: '8',
            name: 'Books & Media',
            slug: 'books-media',
            description: 'Books, movies, and digital media',
            image: '/images/categories/books.jpg',
            productCount: 203,
            icon: 'default'
          }
        ]

        setCategories(mockCategories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4" />
              <div className="h-6 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => {
        const IconComponent = categoryIcons[category.icon] || categoryIcons.default

        return (
          <Link key={category.id} href={`/products?category=${category.slug}`}>
            <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Category Icon */}
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>

                  {/* Category Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {category.productCount} products
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
