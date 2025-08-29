import { Metadata } from 'next'
import { CheckoutForm } from './components/checkout-form'

export const metadata: Metadata = {
  title: 'Checkout - E-Shop',
  description: 'Complete your purchase securely',
}

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">
          Complete your order securely
        </p>
      </div>

      <CheckoutForm />
    </div>
  )
}
