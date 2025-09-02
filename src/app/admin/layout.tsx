import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { AdminRouteGuard } from '@/components/auth/admin-route-guard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // For test pages and login page, render without route guard
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
  const isTestPage = pathname === '/admin/test' || pathname === '/admin/simple'
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/signup'

  if (isTestPage || isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    )
  }

  return (
    <AdminRouteGuard>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminRouteGuard>
  )
}
