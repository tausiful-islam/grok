import { Metadata } from 'next'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = {
  title: 'Sign Up - It\'s Your Choice',
  description: 'Create your account',
}

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Join It&apos;s Your Choice
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create your account to start shopping
        </p>
      </div>
      <SignupForm />
    </div>
  )
}
