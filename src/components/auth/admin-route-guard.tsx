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
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)

  useEffect(() => {
    // Skip auth check for login page and test pages
    if (pathname === '/admin/login' || pathname === '/admin/test' || pathname === '/admin/simple') {
      setHasCheckedAuth(true)
      return
    }

    // If still loading, don't do anything yet
    if (loading) {
      return
    }

    // Mark that we've checked auth
    setHasCheckedAuth(true)

    // If no user, redirect to login
    if (!user) {
      console.log('AdminRouteGuard: No user found, redirecting to login')
      router.push('/admin/login')
      return
    }

    // If user exists but no profile yet, wait for profile to load
    if (!profile) {
      console.log('AdminRouteGuard: User exists but no profile yet, waiting...')
      return
    }

    // Check if user is admin
    const isAdmin = profile.role === 'admin' || profile.role === 'super_admin'
    console.log('AdminRouteGuard: User role check:', { role: profile.role, isAdmin })

    if (!isAdmin) {
      console.log('AdminRouteGuard: User is not admin, redirecting to home')
      router.push('/')
      return
    }

    console.log('AdminRouteGuard: User is admin, allowing access')
  }, [user, profile, loading, router, pathname])

  // Show loading while checking authentication or if we haven't checked yet
  if (loading || !hasCheckedAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // If no user, don't render anything (will redirect)
  if (!user) {
    return null
  }

  // If user exists but no profile, show loading
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Check if user is admin
  const isAdmin = profile.role === 'admin' || profile.role === 'super_admin'

  // If not admin, don't render (will redirect)
  if (!isAdmin) {
    return null
  }

  // User is authenticated and is admin, render children
  return <>{children}</>
}
