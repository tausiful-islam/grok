'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { useOrders } from '@/lib/hooks/use-orders'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User, Package, Mail, Phone, Calendar, Edit, Check, X, MapPin, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface AddressData {
  street?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
}

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const { orders, totalOrders, totalSpent, loading: ordersLoading } = useOrders()
  
  // Editing states
  const [editingName, setEditingName] = useState(false)
  const [editingPhone, setEditingPhone] = useState(false)
  const [editingAddress, setEditingAddress] = useState(false)
  
  // Form states
  const [name, setName] = useState(profile?.name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [address, setAddress] = useState<AddressData>(() => {
    if (profile?.address) {
      const addressData = typeof profile.address === 'string' 
        ? JSON.parse(profile.address) 
        : profile.address
      return {
        street: addressData.street || '',
        city: addressData.city || '',
        state: addressData.state || '',
        postal_code: addressData.postal_code || '',
        country: addressData.country || 'Bangladesh'
      }
    }
    return {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Bangladesh'
    }
  })
  
  // Loading and message states
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Update profile data when profile changes
  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setPhone(profile.phone || '')
      if (profile.address) {
        const addressData = typeof profile.address === 'string' 
          ? JSON.parse(profile.address) 
          : profile.address
        setAddress({
          street: addressData.street || '',
          city: addressData.city || '',
          state: addressData.state || '',
          postal_code: addressData.postal_code || '',
          country: addressData.country || 'Bangladesh'
        })
      }
    }
  }, [profile])

  const updateProfile = async (field: 'name' | 'phone' | 'address', value: any) => {
    if (!user || !profile) return false

    setLoading(true)
    setMessage(null)

    try {
      const updateData: Record<string, any> = {}
      updateData[field] = value

      // Type assertion to work around Supabase type generation issues
      const { error } = await (supabase as any)
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (error) {
        throw error
      }

      await refreshProfile()
      setMessage({ type: 'success', text: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!` })
      return true
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || `Failed to update ${field}` })
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleSaveName = async () => {
    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty' })
      return
    }
    
    const success = await updateProfile('name', name.trim())
    if (success) {
      setEditingName(false)
    }
  }

  const handleSavePhone = async () => {
    const success = await updateProfile('phone', phone.trim() || null)
    if (success) {
      setEditingPhone(false)
    }
  }

  const handleSaveAddress = async () => {
    const success = await updateProfile('address', address)
    if (success) {
      setEditingAddress(false)
    }
  }

  const cancelEdit = (field: 'name' | 'phone' | 'address') => {
    if (field === 'name') {
      setName(profile?.name || '')
      setEditingName(false)
    } else if (field === 'phone') {
      setPhone(profile?.phone || '')
      setEditingPhone(false)
    } else if (field === 'address') {
      if (profile?.address) {
        const addressData = typeof profile.address === 'string' 
          ? JSON.parse(profile.address) 
          : profile.address
        setAddress({
          street: addressData.street || '',
          city: addressData.city || '',
          state: addressData.state || '',
          postal_code: addressData.postal_code || '',
          country: addressData.country || 'Bangladesh'
        })
      }
      setEditingAddress(false)
    }
    setMessage(null)
  }

  if (!user || !profile) {
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information and view your order history</p>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-200 bg-green-50' : ''}`} variant={message.type === 'error' ? 'destructive' : 'default'}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : ''}>{message.text}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Overview */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <Badge variant={profile.role === 'admin' ? 'destructive' : 'secondary'}>
                  {profile.role || 'Customer'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Package className="w-4 h-4" />
                    <span>{totalOrders} Orders</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="w-4 h-4 bg-green-500 rounded-full inline-block"></span>
                    <span>${totalSpent.toFixed(2)} Total Spent</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information with Inline Editing */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email (non-editable) */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                </div>
                
                <Separator />
                
                {/* Name (editable) */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Name</span>
                  </div>
                  {editingName ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-40"
                        placeholder="Enter your name"
                      />
                      <Button
                        size="sm"
                        onClick={handleSaveName}
                        disabled={loading}
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancelEdit('name')}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {profile.name || 'Not provided'}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingName(true)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                {/* Phone (editable) */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">Phone</span>
                  </div>
                  {editingPhone ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-40"
                        placeholder="Enter phone number"
                      />
                      <Button
                        size="sm"
                        onClick={handleSavePhone}
                        disabled={loading}
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancelEdit('phone')}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {profile.phone || 'Not provided'}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingPhone(true)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Address Information with Inline Editing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Address Information
                  </div>
                  {!editingAddress && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingAddress(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Address
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>Your delivery address</CardDescription>
              </CardHeader>
              <CardContent>
                {editingAddress ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Street Address</label>
                      <Textarea
                        value={address.street || ''}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        placeholder="Enter your street address"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">City</label>
                        <Input
                          value={address.city || ''}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          placeholder="Enter your city"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">State/Division</label>
                        <Input
                          value={address.state || ''}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          placeholder="Enter your state/division"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Postal Code</label>
                        <Input
                          value={address.postal_code || ''}
                          onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                          placeholder="Enter postal code"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Country</label>
                        <Input
                          value={address.country || ''}
                          onChange={(e) => setAddress({ ...address, country: e.target.value })}
                          placeholder="Enter your country"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-4">
                      <Button onClick={handleSaveAddress} disabled={loading}>
                        <Check className="w-4 h-4 mr-2" />
                        Save Address
                      </Button>
                      <Button variant="outline" onClick={() => cancelEdit('address')}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {address.street || address.city || address.state ? (
                      <>
                        {address.street && <p className="text-sm">{address.street}</p>}
                        <p className="text-sm">
                          {[address.city, address.state, address.postal_code].filter(Boolean).join(', ')}
                        </p>
                        {address.country && <p className="text-sm font-medium">{address.country}</p>}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">No address provided</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Recent Orders
                </CardTitle>
                <CardDescription>Your latest purchases</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">Start shopping to see your order history here</p>
                    <Link href="/products">
                      <Button>Browse Products</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Order #{order.order_number}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm font-medium">${order.total_amount.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {orders.length > 3 && (
                      <div className="text-center pt-4">
                        <Link href="/profile/orders">
                          <Button variant="outline">View All Orders</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
