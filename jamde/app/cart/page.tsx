'use client'

import Link from "next/link"
import { useCartStore, getCartTotals } from "@/lib/cart-store"
import { QuantitySelect } from "@/components/ui/quantity-select"
import { Button } from "@/components/ui/button"

export default function CartPage() {
  const items = useCartStore(s => s.items)
  const removeItem = useCartStore(s => s.removeItem)
  const updateQuantity = useCartStore(s => s.updateQuantity)
  const clear = useCartStore(s => s.clear)

  const { subtotal, count } = getCartTotals(items)

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-semibold mb-4">Your cart</h1>
        <p className="text-sm text-muted-foreground mb-6">Your cart is empty.</p>
        <Link href="/products" className="text-primary hover:underline">Continue shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-4">Your cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(i => (
            <div key={i.productId} className="flex gap-4 border rounded p-3">
              <img src={i.image} alt={i.name} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1 min-w-0">
                <Link href={`/products/${i.slug}`} className="font-medium line-clamp-1 hover:underline">{i.name}</Link>
                <div className="text-sm text-muted-foreground mb-1">${i.price.toFixed(2)}</div>
                <div className="flex items-center gap-3">
                  <QuantitySelect value={i.quantity} onChange={(q) => updateQuantity(i.productId, q)} max={Math.max(1, Math.min(10, i.stock))} />
                  <Button variant="ghost" onClick={() => removeItem(i.productId)} className="text-red-600">Remove</Button>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={clear}>Clear cart</Button>
        </div>
        <aside className="border rounded p-4 h-max">
          <div className="flex justify-between mb-2"><span className="text-sm">Items</span><span className="text-sm">{count}</span></div>
          <div className="flex justify-between mb-4"><span className="font-medium">Subtotal</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
          <Button className="w-full" disabled={count === 0}>Checkout</Button>
          <p className="text-xs text-muted-foreground mt-2">Taxes and shipping calculated at checkout.</p>
        </aside>
      </div>
    </div>
  )
}



