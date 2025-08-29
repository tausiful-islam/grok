'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

interface Variant {
  id: string
  name: string
  value: string
  price_adjustment: number
}

interface VariantSelectorProps {
  productId: string
  onVariantChange: (variantId: string | null) => void
}

export function VariantSelector({ productId, onVariantChange }: VariantSelectorProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})

  // Mock variants for now
  const mockVariants = {
    color: [
      { id: '1', name: 'Color', value: 'Black', price_adjustment: 0 },
      { id: '2', name: 'Color', value: 'White', price_adjustment: 0 },
      { id: '3', name: 'Color', value: 'Blue', price_adjustment: 10 },
    ],
    size: [
      { id: '4', name: 'Size', value: 'Small', price_adjustment: 0 },
      { id: '5', name: 'Size', value: 'Medium', price_adjustment: 5 },
      { id: '6', name: 'Size', value: 'Large', price_adjustment: 10 },
    ]
  }

  const handleVariantSelect = (variantType: string, variantId: string) => {
    const newSelectedVariants = {
      ...selectedVariants,
      [variantType]: variantId
    }
    setSelectedVariants(newSelectedVariants)

    // For now, just pass the last selected variant
    const lastSelectedId = Object.values(newSelectedVariants).pop()
    onVariantChange(lastSelectedId || null)
  }

  return (
    <div className="space-y-4">
      {Object.entries(mockVariants).map(([variantType, variants]) => (
        <div key={variantType}>
          <h4 className="font-medium mb-2 capitalize">{variantType}</h4>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <Button
                key={variant.id}
                variant={selectedVariants[variantType] === variant.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleVariantSelect(variantType, variant.id)}
                className={cn(
                  "min-w-[60px]",
                  selectedVariants[variantType] === variant.id && "ring-2 ring-primary"
                )}
              >
                {variant.value}
                {variant.price_adjustment > 0 && (
                  <span className="ml-1 text-xs">
                    +${variant.price_adjustment}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
