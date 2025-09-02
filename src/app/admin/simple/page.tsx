'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'

export default function SimpleAdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) {
        setError(`Auth error: ${error.message}`)
        return
      }

      setUser(user)

      if (user) {
        // Try to fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          setError(`Profile error: ${profileError.message} (Code: ${profileError.code})`)
        } else {
          setProfile(profileData)
        }
      }
    } catch (err) {
      setError(`Exception: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setError('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Simple Admin Dashboard</h1>
          {user && (
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Auth Status */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
              <CardDescription>Current user session</CardDescription>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-2">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>ID:</strong> {user.id}</p>
                  <Badge variant="default">Authenticated</Badge>
                </div>
              ) : (
                <Badge variant="destructive">Not Authenticated</Badge>
              )}
            </CardContent>
          </Card>

          {/* Profile Status */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Status</CardTitle>
              <CardDescription>User profile information</CardDescription>
            </CardHeader>
            <CardContent>
              {profile ? (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {profile.name}</p>
                  <p><strong>Role:</strong> {profile.role}</p>
                  <p><strong>Active:</strong> {profile.is_active ? 'Yes' : 'No'}</p>
                  <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                    {profile.role}
                  </Badge>
                </div>
              ) : (
                <Badge variant="destructive">No Profile</Badge>
              )}
            </CardContent>
          </Card>

          {/* Error Status */}
          <Card>
            <CardHeader>
              <CardTitle>Error Status</CardTitle>
              <CardDescription>Any errors encountered</CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              ) : (
                <Badge variant="default">No Errors</Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Test admin functionality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button onClick={checkAuth} variant="outline">
                Refresh Status
              </Button>
              <Button
                onClick={() => window.location.href = '/admin/login'}
                variant="outline"
              >
                Go to Login
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
              >
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
