import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { AdminRouteGuard } from '@/components/auth/admin-route-guard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // For test pages, render without route guard
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
  const isTestPage = pathname === '/admin/test' || pathname === '/admin/simple'

  if (isTestPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <main className="flex-1 p-6">
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
