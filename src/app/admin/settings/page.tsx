'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your store settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" defaultValue="It\'s Your Choice" />
            </div>
            <div>
              <Label htmlFor="storeEmail">Store Email</Label>
              <Input id="storeEmail" type="email" defaultValue="support@eshop.com" />
            </div>
            <div>
              <Label htmlFor="storePhone">Store Phone</Label>
              <Input id="storePhone" defaultValue="+1 (555) 123-4567" />
            </div>
            <div>
              <Label htmlFor="storeAddress">Store Address</Label>
              <Textarea
                id="storeAddress"
                defaultValue="123 Commerce Street&#10;Business District, NY 10001"
                rows={3}
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Stripe Payments</Label>
                <p className="text-sm text-muted-foreground">Accept credit card payments</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>PayPal</Label>
                <p className="text-sm text-muted-foreground">Accept PayPal payments</p>
              </div>
              <input type="checkbox" className="rounded" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Cash on Delivery</Label>
                <p className="text-sm text-muted-foreground">Allow cash payments</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
          </CardContent>
        </Card>

        {/* Shipping Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="freeShipping">Free Shipping Threshold</Label>
              <Input id="freeShipping" type="number" defaultValue="50" />
              <p className="text-sm text-muted-foreground mt-1">
                Minimum order amount for free shipping
              </p>
            </div>
            <div>
              <Label htmlFor="standardShipping">Standard Shipping Rate</Label>
              <Input id="standardShipping" type="number" step="0.01" defaultValue="9.99" />
            </div>
            <div>
              <Label htmlFor="expressShipping">Express Shipping Rate</Label>
              <Input id="expressShipping" type="number" step="0.01" defaultValue="19.99" />
            </div>
            <Button>Update Shipping</Button>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Order Confirmations</Label>
                <p className="text-sm text-muted-foreground">Send email when order is placed</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Shipping Updates</Label>
                <p className="text-sm text-muted-foreground">Send shipping status updates</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Send promotional emails</p>
              </div>
              <input type="checkbox" className="rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
