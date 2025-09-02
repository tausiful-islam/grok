'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save, User, MapPin, Phone, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface AddressData {
  street?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
}

export default function EditProfilePage() {
  const router = useRouter()
  const { user, profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  // Form state
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState<AddressData>({
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Bangladesh'
  })

  // Initialize form with current profile data
  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setPhone(profile.phone || '')
      
      // Parse address if it exists
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile) return

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Validate required fields
      if (!name.trim()) {
        setError('Name is required')
        setLoading(false)
        return
      }

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        // @ts-expect-error - Supabase type generation issue with profiles table
        .update({
          name: name.trim(),
          phone: phone.trim() || null,
          address: address
        })
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      // Refresh profile data
      await refreshProfile()
      
      setSuccess(true)
      
      // Redirect to profile page after 2 seconds
      setTimeout(() => {
        router.push('/profile')
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to edit your profile</h1>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
          <p className="text-muted-foreground">Update your personal information and address</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Profile updated successfully! Redirecting to your profile...
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your basic personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Address Information
              </CardTitle>
              <CardDescription>Update your primary address for delivery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Textarea
                  id="street"
                  value={address.street || ''}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="Enter your street address"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    value={address.city || ''}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="Enter your city"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State/Division</Label>
                  <Input
                    id="state"
                    type="text"
                    value={address.state || ''}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="Enter your state/division"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    type="text"
                    value={address.postal_code || ''}
                    onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                    placeholder="Enter postal code"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    type="text"
                    value={address.country || ''}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    placeholder="Enter your country"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            
            <Link href="/profile" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
