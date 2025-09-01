'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Plus, Edit, Trash2, ArrowLeft, Home, Building } from 'lucide-react'
import Link from 'next/link'

interface Address {
  id: string
  type: 'home' | 'work' | 'other'
  name: string
  street: string
  city: string
  state: string
  zip_code: string
  country: string
  is_default: boolean
}

export default function AddressesPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to manage your addresses</h1>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Mock addresses data - in a real app, this would come from the database
  const addresses: Address[] = [
    // This would be populated from the database
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold mb-2">My Addresses</h1>
          <p className="text-muted-foreground">Manage your delivery and billing addresses</p>
        </div>

        <div className="mb-6">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Address
          </Button>
        </div>

        {addresses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No addresses saved</h3>
              <p className="text-muted-foreground mb-6">Add your delivery addresses for faster checkout and better shopping experience.</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {addresses.map((address: Address) => (
              <Card key={address.id} className={address.is_default ? 'border-primary' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {address.type === 'home' && <Home className="w-4 h-4" />}
                      {address.type === 'work' && <Building className="w-4 h-4" />}
                      {address.type === 'other' && <MapPin className="w-4 h-4" />}
                      <CardTitle className="text-lg">{address.name}</CardTitle>
                    </div>
                    {address.is_default && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <CardDescription className="capitalize">{address.type} Address</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.zip_code}</p>
                    <p>{address.country}</p>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                    {!address.is_default && (
                      <Button variant="outline" size="sm">
                        Set as Default
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Address Form Modal would go here */}
        {/* This would be implemented as a modal or separate page for adding/editing addresses */}
      </div>
    </div>
  )
}
