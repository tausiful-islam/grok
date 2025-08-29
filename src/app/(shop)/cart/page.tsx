import { Metadata } from 'next'
import { CartContent } from './components/cart-content'

export const metadata: Metadata = {
  title: 'Shopping Cart - E-Shop',
  description: 'Review and manage your shopping cart',
}

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
        <p className="text-muted-foreground">
          Review your items and proceed to checkout
        </p>
      </div>

      <CartContent />
    </div>
  )
}
