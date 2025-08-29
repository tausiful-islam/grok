import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Package, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Order Confirmed - E-Shop',
  description: 'Your order has been successfully placed',
}

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 text-left">
              <Package className="h-5 w-5 text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Order Processing</h3>
                <p className="text-sm text-muted-foreground">
                  We're preparing your order for shipment
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-left">
              <Truck className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  You'll receive tracking information via email
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to your email address with order details.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/account/orders">View Order History</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
