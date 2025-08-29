'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Mock login for now
      if (email === 'admin@example.com' && password === 'admin123') {
        // Simulate successful login
        localStorage.setItem('user', JSON.stringify({
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin'
        }))
        router.push('/admin')
      } else if (email && password) {
        // Simulate successful customer login
        localStorage.setItem('user', JSON.stringify({
          id: '2',
          email,
          name: 'Customer User',
          role: 'customer'
        }))
        router.push('/')
      } else {
        setError('Please enter valid credentials')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-500">Admin: admin@example.com / admin123</p>
          <p className="text-xs text-gray-500">Customer: any email / any password</p>
        </div>
      </CardContent>
    </Card>
  )
}
