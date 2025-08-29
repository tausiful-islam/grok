'use client'

import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { AdminRouteGuard } from '@/components/auth/admin-route-guard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
