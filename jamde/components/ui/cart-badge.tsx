'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'

export function CartBadge() {
  const items = useCartStore(s => s.items)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <Link href="/cart" className="relative inline-block">
      <ShoppingCart className="h-6 w-6 text-muted-foreground hover:text-primary transition" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] leading-[18px] text-center">
          {count}
        </span>
      )}
    </Link>
  )
}


