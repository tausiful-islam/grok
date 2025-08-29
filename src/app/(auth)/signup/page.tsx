import { Metadata } from 'next'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = {
  title: 'Sign Up - E-Shop',
  description: 'Create your account',
}

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <a href="/login" className="font-medium text-primary hover:text-primary/80">
            sign in to existing account
          </a>
        </p>
      </div>
      <SignupForm />
    </div>
  )
}
