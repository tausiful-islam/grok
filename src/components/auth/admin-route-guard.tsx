'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth, useIsAdmin } from '@/lib/hooks/use-auth'
import { Loader2 } from 'lucide-react'

interface AdminRouteGuardProps {
  children: React.ReactNode
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user, profile, loading } = useAuth()
  const isAdmin = useIsAdmin()
  const router = useRouter()
  const pathname = usePathname()
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    if (!loading) {
      // If we're on the login page, don't redirect
      if (pathname === '/admin/login') {
        return
      }

      if (!user) {
        // User is not authenticated, redirect to admin login
        // Add a small delay to allow sign out to complete
        setTimeout(() => {
          if (!user) {
            router.push('/admin/login')
          }
        }, 100)
        return
      }

      if (!isAdmin) {
        // User is authenticated but not an admin, redirect to home
        router.push('/')
        return
      }
    }
  }, [user, isAdmin, loading, router, pathname])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated or not an admin, don't render children
  if (!user || !isAdmin) {
    return null
  }

  // User is authenticated and is an admin, render children
  return <>{children}</>
}
