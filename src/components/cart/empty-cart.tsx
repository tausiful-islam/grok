import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">Your cart is empty</h3>
      <p className="mb-6 text-sm text-muted-foreground">
        Add some products to get started
      </p>
      <Button asChild>
        <Link href="/products">
          Continue Shopping
        </Link>
      </Button>
    </div>
  )
}
