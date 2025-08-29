'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/utils'

interface CartItem {
  id: string
  productId: string
  variantId: string | null
  quantity: number
  product: {
    name: string
    price: number
    image: string
  }
}

export function CartContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load cart from localStorage
    const loadCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        setCartItems(cart)
      } catch (error) {
        console.error('Error loading cart:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [])

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedItems)
    localStorage.setItem('cart', JSON.stringify(updatedItems))
  }

  const removeItem = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId)
    setCartItems(updatedItems)
    localStorage.setItem('cart', JSON.stringify(updatedItems))
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add some products to your cart to get started
        </p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Cart Items ({cartItems.length})
          </h2>
          <Button variant="outline" size="sm" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>

        {cartItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-medium mb-1">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {formatPrice(item.product.price)} each
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <Button className="w-full" size="lg" asChild>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
