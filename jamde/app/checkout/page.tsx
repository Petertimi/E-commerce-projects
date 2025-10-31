'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore, getCartTotals } from '@/lib/cart-store'
import { Button } from '@/components/ui/button'

type ShippingForm = {
  fullName: string
  email: string
  phone: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore(s => s.items)
  const { subtotal, count } = useMemo(() => getCartTotals(items), [items])
  const fmt = useMemo(() => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }), [])
  const shippingCost = 10
  const tax = Math.round(subtotal * 0.1 * 100) / 100
  const total = subtotal + shippingCost + tax
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<ShippingForm>({
    fullName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  })

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
        <p className="text-sm text-muted-foreground">Your cart is empty.</p>
        <Button className="mt-4" onClick={() => router.push('/products')}>Continue shopping</Button>
      </div>
    )
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      // Create order first
      const orderRes = await fetch('/api/orders/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items, shipping: form }) })
      if (!orderRes.ok) throw new Error('Order creation failed')
      const { orderId } = await orderRes.json()
      // Initialize payment (Stripe)
      const payRes = await fetch('/api/payments/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items, shipping: form, currency: 'usd', orderId }) })
      if (!payRes.ok) throw new Error('Payment initialization failed')
      const data = await payRes.json()
      if (data.url) {
        window.location.href = data.url as string
      }
    } finally {
      setSubmitting(false)
    }
  }

  function input<K extends keyof ShippingForm>(key: K) {
    return {
      value: form[key] ?? '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(prev => ({ ...prev, [key]: e.target.value })),
      className: 'w-full border rounded px-3 py-2 text-sm',
      required: key !== 'address2',
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border rounded p-4">
            <div className="font-medium mb-3">Shipping information</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Full name</label>
                <input {...input('fullName')} placeholder="Jane Doe" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Email</label>
                <input type="email" {...input('email')} placeholder="jane@example.com" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Phone</label>
                <input {...input('phone')} placeholder="+1 555 123 4567" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Address line 1</label>
                <input {...input('address1')} placeholder="123 Main St" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Address line 2</label>
                <input {...input('address2')} placeholder="Apartment, suite, etc." />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">City</label>
                <input {...input('city')} placeholder="San Francisco" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">State/Province</label>
                <input {...input('state')} placeholder="CA" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Postal code</label>
                <input {...input('postalCode')} placeholder="94105" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Country</label>
                <select {...input('country')}>
                  <option value="US">United States</option>
                  <option value="NG">Nigeria</option>
                  <option value="GB">United Kingdom</option>
                </select>
              </div>
            </div>
          </div>

          {/** Payment method selection removed: order is created first, then payment is initialized */}
        </div>

        <aside className="bg-white border rounded p-4 h-max">
          <div className="font-medium mb-3">Order Summary</div>

          <div className="divide-y">
            {items.map(i => (
              <div key={i.productId} className="py-3 flex items-center gap-3">
                <img src={i.image} alt={i.name} className="w-12 h-12 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium line-clamp-1">{i.name}</div>
                  <div className="text-xs text-muted-foreground">Qty: {i.quantity}</div>
                </div>
                <div className="text-sm">{fmt.format((typeof i.price === 'number' ? i.price : Number(i.price) || 0))}</div>
              </div>
            ))}
          </div>

          <div className="my-3 border-t" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{fmt.format(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{fmt.format(shippingCost)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{fmt.format(tax)}</span></div>
            <div className="flex justify-between pt-2 mt-1 border-t"><span className="font-semibold">Total</span><span className="font-semibold">{fmt.format(total)}</span></div>
          </div>

          <Button className="w-full mt-4" type="submit" disabled={submitting}>{submitting ? 'Redirecting...' : 'Continue to Payment'}</Button>
          <p className="text-xs text-muted-foreground mt-2">You will be redirected to complete your payment.</p>
        </aside>
      </form>
    </div>
  )
}


