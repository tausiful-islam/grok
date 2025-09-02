'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'

export default function TestAdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testSignIn = async () => {
    setLoading(true)
    setResult('Testing sign in...')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setResult(`Sign in failed: ${error.message}`)
      } else {
        setResult(`Sign in successful! User: ${data.user?.email}`)
      }
    } catch (err) {
      setResult(`Exception: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const testProfileFetch = async () => {
    setLoading(true)
    setResult('Testing profile fetch...')

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setResult('No authenticated user found')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        setResult(`Profile fetch failed: ${error.message} (Code: ${error.code})`)
      } else {
        setResult(`Profile fetched: ${JSON.stringify(data, null, 2)}`)
      }
    } catch (err) {
      setResult(`Exception: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const testSession = async () => {
    setLoading(true)
    setResult('Testing session...')

    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        setResult(`Session check failed: ${error.message}`)
      } else {
        setResult(`Session: ${data.session ? 'Active' : 'None'}`)
        if (data.session) {
          setResult(prev => prev + `\nUser: ${data.session?.user.email}`)
        }
      }
    } catch (err) {
      setResult(`Exception: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Admin Panel Test</CardTitle>
            <CardDescription>
              Test authentication and database connectivity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={testSignIn} disabled={loading}>
                Test Sign In
              </Button>
              <Button onClick={testProfileFetch} disabled={loading} variant="outline">
                Test Profile Fetch
              </Button>
              <Button onClick={testSession} disabled={loading} variant="outline">
                Test Session
              </Button>
            </div>

            <div className="mt-4">
              <Label>Result:</Label>
              <pre className="bg-gray-100 p-4 rounded mt-2 text-sm whitespace-pre-wrap">
                {result || 'Click a button to test...'}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
