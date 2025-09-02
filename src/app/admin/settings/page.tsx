'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { 
  Store, 
  Mail, 
  Shield, 
  Database, 
  Palette, 
  Globe,
  Bell,
  CreditCard,
  Truck,
  FileText,
  Save,
  AlertTriangle
} from 'lucide-react'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [settings, setSettings] = useState<Record<string, any>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('setting_key, setting_value, setting_type')

      if (error) throw error

      const settingsMap: Record<string, any> = {}
      data?.forEach((setting: any) => {
        let value = setting.setting_value
        if (setting.setting_type === 'boolean') {
          value = value === true || value === 'true'
        } else if (setting.setting_type === 'number') {
          value = Number(value)
        } else if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1) // Remove quotes from JSON strings
        }
        settingsMap[setting.setting_key] = value
      })
      
      setSettings(settingsMap)
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const updateSetting = async (key: string, value: any, type: string = 'string') => {
    try {
      let processedValue = value
      if (type === 'string') {
        processedValue = `"${value}"`
      } else if (type === 'boolean') {
        processedValue = Boolean(value)
      } else if (type === 'number') {
        processedValue = Number(value)
      }

      const { error } = await supabase
        .from('store_settings')
        .upsert({
          setting_key: key,
          setting_value: processedValue,
          setting_type: type,
          updated_at: new Date().toISOString()
        } as any)

      if (error) throw error

      setSettings(prev => ({ ...prev, [key]: value }))
      return true
    } catch (error) {
      console.error('Error updating setting:', error)
      return false
    }
  }

  const handleSave = async (settingType: string) => {
    setLoading(true)
    try {
      let success = true
      
      if (settingType === 'General') {
        const generalSettings = [
          { key: 'store_name', value: (document.getElementById('store-name') as HTMLInputElement)?.value },
          { key: 'store_url', value: (document.getElementById('store-url') as HTMLInputElement)?.value },
          { key: 'store_description', value: (document.getElementById('store-description') as HTMLTextAreaElement)?.value },
          { key: 'contact_email', value: (document.getElementById('contact-email') as HTMLInputElement)?.value },
          { key: 'contact_phone', value: (document.getElementById('contact-phone') as HTMLInputElement)?.value },
          { key: 'store_address', value: (document.getElementById('store-address') as HTMLTextAreaElement)?.value },
        ]
        
        for (const setting of generalSettings) {
          if (setting.value !== undefined) {
            const result = await updateSetting(setting.key, setting.value, 'string')
            if (!result) success = false
          }
        }
      }
      
      if (success) {
        setMessage(`${settingType} settings saved successfully!`)
      } else {
        setMessage(`Failed to save some ${settingType} settings.`)
      }
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage(`Failed to save ${settingType} settings.`)
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your store configuration and preferences</p>
      </div>

      {message && (
        <Alert className={message.includes('Failed') ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          <AlertDescription className={message.includes('Failed') ? 'text-red-700' : 'text-green-700'}>
            {message}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Store Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input id="store-name" defaultValue={settings.store_name || "It's Your Choice"} />
                </div>
                <div>
                  <Label htmlFor="store-url">Store URL</Label>
                  <Input id="store-url" defaultValue={settings.store_url || "https://itsyourchoice.vercel.app"} />
                </div>
              </div>
              <div>
                <Label htmlFor="store-description">Store Description</Label>
                <Textarea 
                  id="store-description" 
                  defaultValue={settings.store_description || "Discover amazing products at great prices. Fast shipping, secure payments, and excellent customer service."}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input id="contact-email" type="email" defaultValue={settings.contact_email || "contact@itsyourchoice.com"} />
                </div>
                <div>
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input id="contact-phone" defaultValue={settings.contact_phone || "+1 (555) 123-4567"} />
                </div>
              </div>
              <div>
                <Label htmlFor="store-address">Store Address</Label>
                <Textarea 
                  id="store-address" 
                  defaultValue={settings.store_address || "123 Commerce Street, Business District, City, State 12345"}
                  rows={3}
                />
              </div>
              <Button onClick={() => handleSave('General')} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Credit Card Payments</Label>
                      <p className="text-sm text-gray-500">Accept Visa, MasterCard, American Express</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable PayPal</Label>
                      <p className="text-sm text-gray-500">Accept PayPal payments</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Bank Transfer</Label>
                      <p className="text-sm text-gray-500">Accept direct bank transfers</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Cash on Delivery</Label>
                      <p className="text-sm text-gray-500">Allow cash payments on delivery</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stripe-key">Stripe Publishable Key</Label>
                    <Input id="stripe-key" placeholder="pk_test_..." />
                  </div>
                  <div>
                    <Label htmlFor="paypal-client">PayPal Client ID</Label>
                    <Input id="paypal-client" placeholder="AYB..." />
                  </div>
                </div>
                <Button onClick={() => handleSave('Payment')} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Payment Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Free Shipping</Label>
                    <p className="text-sm text-gray-500">Offer free shipping on all orders</p>
                  </div>
                  <Switch />
                </div>
                <div>
                  <Label htmlFor="free-shipping-threshold">Free Shipping Threshold ($)</Label>
                  <Input id="free-shipping-threshold" type="number" defaultValue="50" />
                  <p className="text-sm text-gray-500">Minimum order amount for free shipping</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="standard-shipping">Standard Shipping Rate ($)</Label>
                    <Input id="standard-shipping" type="number" defaultValue="5.99" />
                  </div>
                  <div>
                    <Label htmlFor="express-shipping">Express Shipping Rate ($)</Label>
                    <Input id="express-shipping" type="number" defaultValue="12.99" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="standard-delivery">Standard Delivery Time (days)</Label>
                    <Input id="standard-delivery" defaultValue="3-5" />
                  </div>
                  <div>
                    <Label htmlFor="express-delivery">Express Delivery Time (days)</Label>
                    <Input id="express-delivery" defaultValue="1-2" />
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSave('Shipping')} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save Shipping Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Order Notifications</Label>
                      <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Low Stock Alerts</Label>
                      <p className="text-sm text-gray-500">Get notified when products are running low</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Customer Registration</Label>
                      <p className="text-sm text-gray-500">Get notified when new customers register</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-gray-500">Receive weekly performance reports</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <h3 className="font-medium pt-4">SMS Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Critical Alerts</Label>
                      <p className="text-sm text-gray-500">Urgent notifications via SMS</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSave('Notification')} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Add an extra layer of security to admin accounts</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Force HTTPS</Label>
                    <p className="text-sm text-gray-500">Redirect all traffic to HTTPS</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-gray-500">Automatically log out inactive users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div>
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue="60" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Login Attempt Limit</Label>
                    <p className="text-sm text-gray-500">Limit failed login attempts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div>
                  <Label htmlFor="login-attempts">Max Login Attempts</Label>
                  <Input id="login-attempts" type="number" defaultValue="5" />
                </div>
              </div>
              <Button onClick={() => handleSave('Security')} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database & Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Caching</Label>
                      <p className="text-sm text-gray-500">Improve performance with Redis caching</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Debug Mode</Label>
                      <p className="text-sm text-gray-500">Enable detailed error logging</p>
                    </div>
                    <Switch />
                  </div>
                  <div>
                    <Label htmlFor="backup-frequency">Backup Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue placeholder="Select backup frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={() => handleSave('Advanced')} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Advanced Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    These actions are irreversible. Please proceed with caution.
                  </AlertDescription>
                </Alert>
                <div className="space-y-3">
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    Export All Data
                  </Button>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    Reset Analytics Data
                  </Button>
                  <Button variant="destructive">
                    Delete All Customer Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
