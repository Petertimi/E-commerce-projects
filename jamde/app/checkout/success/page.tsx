import Link from 'next/link'
import { Suspense } from 'react'

export default function SuccessPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-semibold mb-3">Thank you for your order</h1>
      <p className="text-sm text-muted-foreground mb-6">Your payment was received. A confirmation email will be sent shortly.</p>
      <Suspense>
        {/* Client effect to clear cart */}
        <ClearCartClient />
      </Suspense>
      <div className="flex justify-center gap-4">
        <Link className="px-4 py-2 rounded bg-primary text-white" href="/products">Continue shopping</Link>
        <Link className="px-4 py-2 rounded border" href="/account/orders">View orders</Link>
      </div>
    </div>
  )
}

function ClearCartClient() {
  return <script dangerouslySetInnerHTML={{ __html: `
    try {
      // Keep only persisted key but empty items
      const raw = localStorage.getItem('cart-store')
      if (raw) {
        const j = JSON.parse(raw)
        j.state = { ...j.state, items: [] }
        localStorage.setItem('cart-store', JSON.stringify(j))
        window.dispatchEvent(new StorageEvent('storage', { key: 'cart-store' }))
      }
    } catch {}
  ` }} />
}




