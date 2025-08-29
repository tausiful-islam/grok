import { Metadata } from 'next'
import { AdminOrdersTable } from './components/admin-orders-table'

export const metadata: Metadata = {
  title: 'Orders - Admin',
  description: 'Manage customer orders',
}

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage customer orders and fulfillment</p>
      </div>

      <AdminOrdersTable />
    </div>
  )
}
