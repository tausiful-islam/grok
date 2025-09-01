'use client'

import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/hooks/use-cart'
import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  price: number
  image?: string
  category?: string
}

interface AddToCartButtonProps {
  product: Product
  disabled?: boolean
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function AddToCartButton({ 
  product, 
  disabled = false, 
  variant = 'default',
  size = 'default',
  className = ''
}: AddToCartButtonProps) {
  const { addItem, items } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const isInCart = items.some(item => item.id === product.id)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || '/images/placeholder-product.svg',
      category: product.category
    })

    setIsAdded(true)
    toast.success('Added to cart!')

    // Reset the state after animation
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled}
      variant={variant}
      size={size}
      className={className}
    >
      {isAdded ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isInCart ? 'Add Another' : 'Add to Cart'}
        </>
      )}
    </Button>
  )
}
