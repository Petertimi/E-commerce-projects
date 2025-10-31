import { NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const body = await req.json()
  const { items, shipping } = body as { items: Array<{ productId: string; name: string; price: number; quantity: number }>; shipping: any }
  if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'No items' }, { status: 400 })

  const email: string | undefined = shipping?.email
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  // Find or create customer by email (guest checkout)
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: shipping?.fullName ?? null },
  })

  const subtotal = items.reduce((s, i) => s + (typeof i.price === 'number' ? i.price : Number(i.price) || 0) * (i.quantity ?? 1), 0)
  const shippingCost = 10
  const tax = Math.round(subtotal * 0.1 * 100) / 100
  const total = subtotal + shippingCost + tax

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      subtotal,
      shippingCost,
      tax,
      total,
      shippingAddress: shipping ?? {},
      items: {
        create: items.map(i => ({ productId: i.productId, quantity: i.quantity ?? 1, price: (typeof i.price === 'number' ? i.price : Number(i.price) || 0) })),
      },
    },
    select: { id: true },
  })

  return NextResponse.json({ orderId: order.id, subtotal, shippingCost, tax, total })
}


