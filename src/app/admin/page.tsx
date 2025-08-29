import { Metadata } from 'next'
import { AdminStats } from './components/admin-stats'
import { RecentOrders } from './components/recent-orders'
import { TopProducts } from './components/top-products'
import { SalesChart } from './components/sales-chart'

export const metadata: Metadata = {
  title: 'Admin Dashboard - E-Shop',
  description: 'E-Shop administration dashboard',
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      <AdminStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <RecentOrders />
      </div>

      <TopProducts />
    </div>
  )
}
