'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { useOrders } from '@/lib/hooks/use-orders'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  ShoppingBag, 
  Edit3, 
  Save, 
  X, 
  Plus,
  Trash2,
  Home,
  Building2
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Division {
  id: string
  name: string
  code: string
}

interface District {
  id: string
  name: string
  division_id: string
}

interface Address {
  id: string
  label: string
  name: string
  phone: string
  division_id: string
  district_id: string
  home_address: string
  postal_code: string
  is_default: boolean
  division?: Division
  district?: District
}

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const { orders } = useOrders()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  
  // Profile editing states
  const [editingField, setEditingField] = useState<string | null>(null)
  const [tempValues, setTempValues] = useState<Record<string, string>>({})

  // Address states
  const [addresses, setAddresses] = useState<Address[]>([])
  const [divisions, setDivisions] = useState<Division[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<string | null>(null)
  const [addressLoading, setAddressLoading] = useState(false)

  // New address form state
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    name: '',
    phone: '',
    division_id: '',
    district_id: '',
    home_address: '',
    postal_code: ''
  })

  useEffect(() => {
    if (user) {
      fetchAddresses()
      fetchDivisions()
    }
  // We intentionally call fetchAddresses and fetchDivisions when the user changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    if (newAddress.division_id) {
      fetchDistricts(newAddress.division_id)
    } else {
      setDistricts([])
      setNewAddress(prev => ({ ...prev, district_id: '' }))
    }
  }, [newAddress.division_id])

  const fetchAddresses = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('customer_addresses')
        .select(`
          *,
          division:divisions(id, name, code),
          district:districts(id, name)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('is_default', { ascending: false })

      if (error) throw error
      setAddresses(data || [])
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }
  }

  const fetchDivisions = async () => {
    try {
      const response = await fetch('/api/divisions')
      const data = await response.json()
      if (data.divisions) {
        setDivisions(data.divisions)
      }
    } catch (error) {
      console.error('Error fetching divisions:', error)
    }
  }

  const fetchDistricts = async (divisionId: string) => {
    try {
      const response = await fetch(`/api/districts?division_id=${divisionId}`)
      const data = await response.json()
      if (data.districts) {
        setDistricts(data.districts)
      }
    } catch (error) {
      console.error('Error fetching districts:', error)
    }
  }

  const handleFieldEdit = (field: string, value: string) => {
    setEditingField(field)
    setTempValues({ [field]: value })
  }

  const handleFieldSave = async (field: string) => {
    if (!user) return

    setLoading(true)
    setMessage(null)

    try {
      const updateData: Record<string, any> = {}
      updateData[field] = tempValues[field]

      // Type assertion to work around Supabase type generation issues
      const { error } = await (supabase as any)
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (error) {
        throw error
      }

      setMessage('Profile updated successfully!')
      setEditingField(null)
      setTempValues({})
      await refreshProfile()

      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFieldCancel = () => {
    setEditingField(null)
    setTempValues({})
  }

  const handleAddAddress = async () => {
    if (!user) return
    if (!newAddress.name || !newAddress.division_id || !newAddress.district_id || !newAddress.home_address) {
      setMessage('Please fill in all required fields')
      return
    }

    setAddressLoading(true)
    try {
      const { error } = await (supabase as any)
        .from('customer_addresses')
        .insert({
          user_id: user.id,
          ...newAddress
        })

      if (error) throw error

      setMessage('Address added successfully!')
      setNewAddress({
        label: 'Home',
        name: '',
        phone: '',
        division_id: '',
        district_id: '',
        home_address: '',
        postal_code: ''
      })
      setShowAddressForm(false)
      await fetchAddresses()
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error adding address:', error)
      setMessage('Failed to add address. Please try again.')
    } finally {
      setAddressLoading(false)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      const { error } = await (supabase as any)
        .from('customer_addresses')
        .update({ is_active: false })
        .eq('id', addressId)

      if (error) throw error

      setMessage('Address deleted successfully!')
      await fetchAddresses()
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error deleting address:', error)
      setMessage('Failed to delete address. Please try again.')
    }
  }

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('customer_addresses')
        .update({ is_default: true })
        .eq('id', addressId)

      if (error) throw error

      setMessage('Default address updated!')
      await fetchAddresses()
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error updating default address:', error)
      setMessage('Failed to update default address. Please try again.')
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{profile?.name || 'My Profile'}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`p-4 rounded-md ${message.includes('Failed') || message.includes('Error') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
            <CardDescription>
              Manage your account details and personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name Field */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="name">Full Name</Label>
                {editingField === 'name' ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      value={tempValues.name || ''}
                      onChange={(e) => setTempValues({ ...tempValues, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="flex-1"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleFieldSave('name')}
                      disabled={loading}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleFieldCancel}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm">{profile?.name || 'Not set'}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleFieldEdit('name', profile?.name || '')}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Phone Field */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="phone">Phone Number</Label>
                {editingField === 'phone' ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      value={tempValues.phone || ''}
                      onChange={(e) => setTempValues({ ...tempValues, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      className="flex-1"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleFieldSave('phone')}
                      disabled={loading}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleFieldCancel}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm">{profile?.phone || 'Not set'}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleFieldEdit('phone', profile?.phone || '')}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Email (Read-only) */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label>Email Address</Label>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm">{user.email}</span>
                  <Badge variant="secondary">Verified</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Addresses</span>
                </CardTitle>
                <CardDescription>
                  Manage your delivery addresses
                </CardDescription>
              </div>
              <Button onClick={() => setShowAddressForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Address List */}
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <div key={address.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {address.label === 'Home' ? (
                        <Home className="h-4 w-4 text-blue-500" />
                      ) : address.label === 'Office' ? (
                        <Building2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <MapPin className="h-4 w-4 text-gray-500" />
                      )}
                      <span className="font-medium">{address.label}</span>
                      {address.is_default && (
                        <Badge variant="default" className="text-xs">Default</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {!address.is_default && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSetDefaultAddress(address.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">{address.name}</p>
                    {address.phone && <p>{address.phone}</p>}
                    <p>{address.home_address}</p>
                    <p>
                      {address.district?.name}, {address.division?.name}
                      {address.postal_code && ` - ${address.postal_code}`}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No addresses found. Add your first address to get started.</p>
              </div>
            )}

            {/* Add Address Form */}
            {showAddressForm && (
              <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Add New Address</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowAddressForm(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="label">Address Label</Label>
                    <Select 
                      value={newAddress.label} 
                      onValueChange={(value) => setNewAddress({ ...newAddress, label: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Home">Home</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                      placeholder="Recipient name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      placeholder="Contact number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="division">Division *</Label>
                    <Select 
                      value={newAddress.division_id} 
                      onValueChange={(value) => setNewAddress({ ...newAddress, division_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Division" />
                      </SelectTrigger>
                      <SelectContent>
                        {divisions.map((division) => (
                          <SelectItem key={division.id} value={division.id}>
                            {division.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="district">District *</Label>
                    <Select 
                      value={newAddress.district_id} 
                      onValueChange={(value) => setNewAddress({ ...newAddress, district_id: value })}
                      disabled={!newAddress.division_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district.id} value={district.id}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                      value={newAddress.postal_code}
                      onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                      placeholder="Postal code"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="home_address">Home Address *</Label>
                  <Textarea
                    value={newAddress.home_address}
                    onChange={(e) => setNewAddress({ ...newAddress, home_address: e.target.value })}
                    placeholder="House number, street address, area..."
                    required
                  />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={handleAddAddress}
                    disabled={addressLoading}
                  >
                    {addressLoading ? 'Adding...' : 'Add Address'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddressForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Recent Orders</span>
            </CardTitle>
            <CardDescription>
              Your latest purchases and order history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Order #{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()} • ${order.total_amount.toFixed(2)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        order.status === 'delivered' ? 'default' :
                        order.status === 'shipped' ? 'secondary' :
                        order.status === 'processing' ? 'outline' : 'destructive'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                ))}
                <Link href="/profile/orders">
                  <Button variant="outline" className="w-full">
                    View All Orders
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">No orders yet</p>
                <Link href="/products">
                  <Button>
                    Start Shopping
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
