'use client'

import Link from 'next/link'
import { User, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MobileMenuProps {
  onClose: () => void
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const handleLinkClick = () => {
    onClose()
  }

  return (
    <div className="border-t bg-background md:hidden">
      <div className="container mx-auto px-4 py-4">
        <nav className="space-y-4">
          <Link
            href="/products"
            className="block py-2 text-sm font-medium transition-colors hover:text-primary"
            onClick={handleLinkClick}
          >
            Products
          </Link>
          <Link
            href="/categories"
            className="block py-2 text-sm font-medium transition-colors hover:text-primary"
            onClick={handleLinkClick}
          >
            Categories
          </Link>
          <Link
            href="/about"
            className="block py-2 text-sm font-medium transition-colors hover:text-primary"
            onClick={handleLinkClick}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block py-2 text-sm font-medium transition-colors hover:text-primary"
            onClick={handleLinkClick}
          >
            Contact
          </Link>
        </nav>

        <div className="mt-6 space-y-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/auth/login" onClick={handleLinkClick}>
              <User className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/cart" onClick={handleLinkClick}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
