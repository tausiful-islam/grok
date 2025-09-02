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

  useEffect(() => {
    // Bypass guard on auth/test pages
    if (pathname === '/admin/login' || pathname === '/admin/test' || pathname === '/admin/simple') {
      setStatus('bypass')
      return
    }

    // If still loading, remain checking
    if (loading) {
      setStatus('checking')
      return
    }

    // No user -> redirect to login
    if (!user) {
      setStatus('redirect')
      router.replace('/admin/login')
      return
    }

    // User present, wait for profile
    if (!profile) {
      setStatus('checking')
      return
    }

    const isAdmin = profile.role === 'admin' || profile.role === 'super_admin'
    if (!isAdmin) {
      setStatus('redirect')
      router.replace('/')
      return
    }

    setStatus('allowed')
  }, [user, profile, loading, pathname, router])

  // Guard UI states
  if (status === 'bypass') return <>{children}</>
  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    )
  }
  if (status === 'redirect') return null
  return <>{children}</>
}
