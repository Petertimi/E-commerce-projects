'use client'

import { useState } from 'react'
import { QuantitySelect } from './quantity-select'
import { AddToCartButton } from './add-to-cart-button'

interface ProductPurchasePanelProps {
  productId: string
  name: string
  price: number
  slug: string
  image: string
  stock: number
}

export function ProductPurchasePanel({ productId, name, price, slug, image, stock }: ProductPurchasePanelProps) {
  const [qty, setQty] = useState(1)
  const max = Math.max(1, Math.min(10, stock))

  return (
    <div>
      <div className="text-sm font-medium mb-2">Quantity</div>
      <QuantitySelect value={qty} onChange={setQty} max={max} />
      <div className="mt-4">
        <AddToCartButton productId={productId} name={name} price={price} slug={slug} image={image} stock={stock} disabled={stock <= 0} quantity={qty} className="w-full py-6" />
      </div>
    </div>
  )
}


