'use client'

import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99
}: QuantitySelectorProps) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min
    if (newValue >= min && newValue <= max) {
      onChange(newValue)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={value <= min}
        className="h-8 w-8"
      >
        <Minus className="h-3 w-3" />
      </Button>

      <Input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        className="w-16 h-8 text-center"
      />

      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={value >= max}
        className="h-8 w-8"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}
