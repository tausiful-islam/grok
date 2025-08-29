'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Subscribe email:', email)
    setIsSubscribed(true)
    setEmail('')
  }

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto bg-background/95 backdrop-blur">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <Mail className="h-12 w-12 mx-auto text-primary mb-4" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter and get exclusive deals,
              new product announcements, and special offers delivered to your inbox.
            </p>

            {isSubscribed ? (
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-600 mb-2">
                  Thank you for subscribing!
                </h3>
                <p className="text-sm text-muted-foreground">
                  You&apos;ll receive our latest updates soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit">
                  Subscribe
                </Button>
              </form>
            )}

            <p className="text-xs text-muted-foreground mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
