export const dynamic = 'force-dynamic'
import { Metadata } from 'next'
import { AdminStats } from '../components/admin-stats'
import { RecentOrders } from '../components/recent-orders'
import { TopProducts } from '../components/top-products'
import { SalesChart } from '../components/sales-chart'
import { RecentActivities } from '../components/recent-activities'
import { QuickActions } from '../components/quick-actions'

export const metadata: Metadata = {
  title: 'Overview - Admin Dashboard',
  description: 'Comprehensive overview of store performance and metrics',
}

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-600">Get a comprehensive view of your store&apos;s performance</p>
        </div>
        <QuickActions />
      </div>

      {/* Key Metrics */}
      <AdminStats />

      {/* Charts and Data Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <RecentActivities />
        </div>
      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders />
        <TopProducts />
      </div>
    </div>
  )
}
