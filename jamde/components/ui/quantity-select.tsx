'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { useCallback } from 'react'

interface QuantitySelectProps {
  value: number
  onChange: (qty: number) => void
  max?: number
}

export function QuantitySelect({ value, onChange, max = 10 }: QuantitySelectProps) {
  const handleChange = useCallback((val: string) => {
    const n = Number(val)
    if (Number.isFinite(n)) onChange(n)
  }, [onChange])

  const items = Array.from({ length: Math.max(1, Math.min(max, 99)) }, (_, i) => i + 1)

  return (
    <Select value={String(value)} onValueChange={handleChange}>
      <SelectTrigger className="w-24">
        <SelectValue placeholder="1" />
      </SelectTrigger>
      <SelectContent>
        {items.map(n => (
          <SelectItem key={n} value={String(n)}>{n}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}


