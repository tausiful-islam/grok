'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Eye, Package } from 'lucide-react'
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

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  productCount: number
  isActive: boolean
  createdAt: string
}

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and electronic devices',
    productCount: 245,
    isActive: true,
    createdAt: '2023-01-15',
  },
  {
    id: '2',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion and apparel for all styles',
    productCount: 189,
    isActive: true,
    createdAt: '2023-02-20',
  },
  {
    id: '3',
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Everything for your home and garden',
    productCount: 156,
    isActive: true,
    createdAt: '2023-03-10',
  },
  {
    id: '4',
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    description: 'Gear for your active lifestyle',
    productCount: 98,
    isActive: true,
    createdAt: '2023-04-05',
  },
  {
    id: '5',
    name: 'Books & Media',
    slug: 'books-media',
    description: 'Books, movies, and digital media',
    productCount: 203,
    isActive: false,
    createdAt: '2023-05-12',
  },
]

export function AdminCategoriesTable() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (categoryId: string) => {
    setCategories(categories.filter(c => c.id !== categoryId))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Categories ({filteredCategories.length})</CardTitle>
        <div className="flex space-x-2">
          <Input
            placeholder="Search categories..."
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
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{category.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {category.slug}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate">
                    {category.description || 'No description'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {category.productCount} products
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={category.isActive ? 'default' : 'secondary'}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>{category.createdAt}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/categories/${category.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
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
