import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopping Cart - It\'s Your Choice',
  description: 'Review your cart items and proceed to checkout',
}

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
