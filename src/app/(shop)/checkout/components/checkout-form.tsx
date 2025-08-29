'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Truck, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { formatPrice } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

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

interface CheckoutFormData {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  cardNumber: string
  expiryDate: string
  cvv: string
  saveInfo: boolean
}

export function CheckoutForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveInfo: false
  })

  useEffect(() => {
    // Load cart from localStorage
    const loadCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        setCartItems(cart)
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }

    loadCart()
  }, [])

  const handleInputChange = (field: keyof CheckoutFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Mock checkout process
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Clear cart
      localStorage.removeItem('cart')

      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase",
      })

      router.push('/checkout/success')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your order",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const shippingCost = shippingMethod === 'express' ? 19.99 : shippingMethod === 'standard' ? 9.99 : 0
  const tax = subtotal * 0.08
  const total = subtotal + shippingCost + tax

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Your cart is empty</p>
        <Button className="mt-4" asChild>
          <a href="/products">Continue Shopping</a>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Checkout Form */}
      <div className="space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Method */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="free" id="free" />
                <Label htmlFor="free" className="flex-1">
                  <div className="flex justify-between">
                    <span>Free Shipping (5-7 business days)</span>
                    <span>Free</span>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="flex-1">
                  <div className="flex justify-between">
                    <span>Standard Shipping (2-3 business days)</span>
                    <span>$9.99</span>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="express" id="express" />
                <Label htmlFor="express" className="flex-1">
                  <div className="flex justify-between">
                    <span>Express Shipping (1 business day)</span>
                    <span>$19.99</span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="saveInfo"
                checked={formData.saveInfo}
                onCheckedChange={(checked) => handleInputChange('saveInfo', checked as boolean)}
              />
              <Label htmlFor="saveInfo">Save payment information for future purchases</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div>
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cart Items */}
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Place Order
                </>
              )}
            </Button>

            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                Secure checkout
              </div>
              <div className="flex items-center">
                <Truck className="h-4 w-4 mr-1" />
                Fast delivery
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
