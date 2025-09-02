'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { AdminRouteGuard } from '@/components/auth/admin-route-guard'
import { useAuth, useIsAdmin } from '@/lib/hooks/use-auth'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const isAdmin = useIsAdmin()
  const router = useRouter()
  const pathname = usePathname()

  // Handle sign out redirect at layout level
  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      console.log('Admin layout: No user found, redirecting to login')
      router.push('/admin/login')
    }
  }, [user, loading, router, pathname])

  // If on login page, don't show admin layout
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <AdminRouteGuard>
            {children}
          </AdminRouteGuard>
        </main>
      </div>
    </div>
  )
}
