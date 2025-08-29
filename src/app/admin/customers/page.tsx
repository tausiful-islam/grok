import { Metadata } from 'next'
import { AdminCustomersTable } from './components/admin-customers-table'

export const metadata: Metadata = {
  title: 'Customers - Admin',
  description: 'Manage customer accounts',
}

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600">Manage customer accounts and information</p>
      </div>

      <AdminCustomersTable />
    </div>
  )
}
