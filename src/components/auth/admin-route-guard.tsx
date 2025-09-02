'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { Loader2 } from 'lucide-react'

interface AdminRouteGuardProps {
  children: React.ReactNode
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [status, setStatus] = useState<'bypass' | 'checking' | 'redirect' | 'allowed'>('checking')
  const [checkingTimeout, setCheckingTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Clear any existing timeout
    if (checkingTimeout) {
      clearTimeout(checkingTimeout)
      setCheckingTimeout(null)
    }

    // Bypass guard on auth/test pages
    if (pathname === '/admin/login' || pathname === '/admin/test' || pathname === '/admin/simple') {
      setStatus('bypass')
      return
    }

    console.log('AdminRouteGuard - Status check:', { user: !!user, profile: !!profile, loading })

    // If still loading, wait with timeout
    if (loading) {
      setStatus('checking')
      // Set a timeout to prevent infinite checking
      const timeout = setTimeout(() => {
        console.log('AdminRouteGuard - Timeout reached, redirecting to login')
        setStatus('redirect')
        router.replace('/admin/login')
      }, 10000) // 10 second timeout
      setCheckingTimeout(timeout)
      return
    }

    // No user -> redirect to login
    if (!user) {
      console.log('AdminRouteGuard - No user, redirecting to login')
      setStatus('redirect')
      router.replace('/admin/login')
      return
    }

    // User present but no profile after loading finished -> redirect
    if (!profile) {
      console.log('AdminRouteGuard - User exists but no profile found, redirecting to login')
      setStatus('redirect')
      router.replace('/admin/login')
      return
    }

    // Check admin role
    const isAdmin = profile.role === 'admin' || profile.role === 'super_admin'
    console.log('AdminRouteGuard - Role check:', { role: profile.role, isAdmin })
    
    if (!isAdmin) {
      console.log('AdminRouteGuard - Not admin, redirecting to home')
      setStatus('redirect')
      router.replace('/')
      return
    }

    console.log('AdminRouteGuard - Admin access granted')
    setStatus('allowed')
  }, [user, profile, loading, pathname, router])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (checkingTimeout) {
        clearTimeout(checkingTimeout)
      }
    }
  }, [checkingTimeout])

  // Guard UI states
  if (status === 'bypass') return <>{children}</>
  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin access...</p>
          <p className="text-xs text-muted-foreground mt-2">
            Loading: {loading ? 'Yes' : 'No'} | User: {user ? 'Yes' : 'No'} | Profile: {profile ? 'Yes' : 'No'}
          </p>
        </div>
      </div>
    )
  }
  if (status === 'redirect') return null
  return <>{children}</>
}
