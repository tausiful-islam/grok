'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

interface ProductImage {
  id: string
  url: string
  alt_text: string
  is_primary: boolean
}

interface Product {
  id: string
  name: string
  images: ProductImage[]
}

interface ProductGalleryProps {
  product: Product
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = product.images.length > 0
    ? product.images
    : [{ id: 'default', url: '/images/placeholder-product.svg', alt_text: product.name, is_primary: true }]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[currentImageIndex].url}
          alt={images[currentImageIndex].alt_text}
          fill
          className="object-cover"
          priority
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToImage(index)}
              className={cn(
                "relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors",
                index === currentImageIndex
                  ? "border-primary"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <Image
                src={image.url}
                alt={image.alt_text}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
