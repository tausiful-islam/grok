export const dynamic = 'force-dynamic'
import { Metadata } from 'next'
import { AdminLoginForm } from '@/components/auth/admin-login-form'

export const metadata: Metadata = {
  title: 'Admin Login - It\'s Your Choice',
  description: 'Sign in to admin panel',
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Panel Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in with your admin credentials
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}
