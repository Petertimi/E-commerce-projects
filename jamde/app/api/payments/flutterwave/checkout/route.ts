import { NextResponse } from 'next/server'
import { getFlutterwave } from '@/lib/payments/flutterwave'

export async function POST(req: Request) {
  const body = await req.json()
  const { items, shipping, currency = 'NGN' } = body as { items: any[]; shipping: any; currency?: string }
  if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'No items' }, { status: 400 })

  const origin = process.env.NEXT_PUBLIC_APP_URL || (req.headers.get('origin') ?? '')
  const flw = getFlutterwave()
  const tx_ref = `tx_${Date.now()}`
  const amount = Math.max(1, items.reduce((sum: number, i: any) => sum + (i.price ?? 0) * (i.quantity ?? 1), 0))

  const payload: any = {
    tx_ref,
    amount,
    currency,
    redirect_url: `${origin}/checkout/success?ps=flutterwave&tx_ref=${tx_ref}`,
    customer: {
      email: shipping?.email || 'customer@example.com',
      name: shipping?.fullName || 'Customer',
      phonenumber: shipping?.phone || '',
    },
    meta: {
      shipping,
      items: items.map((i: any) => ({ id: i.productId, name: i.name, qty: i.quantity, price: i.price })),
    },
  }

  const response = await flw.Payment.initialize(payload)
  return NextResponse.json({ id: response?.data?.id, url: response?.data?.link })
}







