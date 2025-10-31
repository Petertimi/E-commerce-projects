import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/payments/stripe'

export async function POST(req: Request) {
  const body = await req.json()
  const { items, shipping, currency = 'usd', orderId } = body as { items: any[]; shipping: any; currency?: string; orderId?: string }
  if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'No items' }, { status: 400 })

  const stripe = getStripe()
  const origin = process.env.NEXT_PUBLIC_APP_URL || (req.headers.get('origin') ?? '')

  const line_items = items.map((i: any) => ({
    price_data: {
      currency,
      product_data: { name: i.name },
      unit_amount: Math.round((i.price ?? 0) * 100),
    },
    quantity: i.quantity ?? 1,
  }))

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items,
    success_url: `${origin}/checkout/success?ps=stripe&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout`,
    metadata: {
      shipping: JSON.stringify(shipping ?? {}),
      orderId: orderId ?? '',
    },
  })

  return NextResponse.json({ id: session.id, url: session.url })
}


