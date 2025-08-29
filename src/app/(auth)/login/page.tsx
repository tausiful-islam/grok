import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Login - E-Shop',
  description: 'Sign in to your account',
}

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <a href="/signup" className="font-medium text-primary hover:text-primary/80">
            create a new account
          </a>
        </p>
      </div>
      <LoginForm />
    </div>
  )
}
