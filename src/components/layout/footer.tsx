import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/images/It’s your Choice.png" 
                alt="It's Your Choice Logo" 
                className="h-8 w-auto"
              />
              <div className="text-2xl font-bold text-primary">
                It's Your Choice
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted online shopping destination. Quality products,
              fast delivery, and excellent customer service.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/products"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/about"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Customer Service</h3>
            <div className="space-y-2">
              <Link
                href="/shipping"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Shipping Info
              </Link>
              <Link
                href="/returns"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Returns & Exchanges
              </Link>
              <Link
                href="/faq"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/support"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Support
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="mr-2 h-4 w-4" />
                +880 123 456 7890
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />
                support@example.com
              </div>
              <div className="flex items-start text-sm text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4 mt-0.5" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 It's Your Choice. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
