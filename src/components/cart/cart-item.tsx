'use client'

import Image from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils/format'

interface CartItemProps {
  item: {
    id: string
    productId: string
    variantId?: string
    name: string
    price: number
    image: string
    quantity: number
    variant?: string
  }
}

export function CartItem({ item }: CartItemProps) {
  const handleQuantityChange = (newQuantity: number) => {
    // This will be connected to cart store later
    console.log('Update quantity:', item.id, newQuantity)
  }

  const handleRemove = () => {
    // This will be connected to cart store later
    console.log('Remove item:', item.id)
  }

  return (
    <div className="flex items-center space-x-4 border-b pb-4">
      {/* Product Image */}
      <div className="relative h-16 w-16 overflow-hidden rounded-md">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 space-y-1">
        <h4 className="text-sm font-medium line-clamp-2">{item.name}</h4>
        {item.variant && (
          <p className="text-xs text-muted-foreground">{item.variant}</p>
        )}
        <p className="text-sm font-semibold">{formatPrice(item.price)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center text-sm">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={handleRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
