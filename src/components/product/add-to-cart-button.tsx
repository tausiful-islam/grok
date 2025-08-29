'use client'

import { useState } from 'react'
import { ShoppingCart, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface Product {
  id: string
  name: string
  price: number
  salePrice: number | null
  stockQuantity: number
}

interface AddToCartButtonProps {
  product: Product
  variantId: string | null
  quantity: number
}

export function AddToCartButton({ product, variantId, quantity }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAddToCart = async () => {
    setIsLoading(true)

    try {
      // Mock add to cart functionality
      const cartItem = {
        id: Date.now().toString(),
        productId: product.id,
        variantId,
        quantity,
        product: {
          name: product.name,
          price: product.salePrice || product.price,
          image: '/images/placeholder-product.svg'
        }
      }

      // Get existing cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')

      // Check if item already exists
      const existingItemIndex = existingCart.findIndex(
        (item: any) => item.productId === product.id && item.variantId === variantId
      )

      if (existingItemIndex >= 0) {
        // Update quantity
        existingCart[existingItemIndex].quantity += quantity
      } else {
        // Add new item
        existingCart.push(cartItem)
      }

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart))

      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} added to your cart`,
      })

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isOutOfStock = product.stockQuantity === 0

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading || isOutOfStock}
      className="w-full"
      size="lg"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="mr-2 h-4 w-4" />
      )}
      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
    </Button>
  )
}
