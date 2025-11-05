import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, shipping } = body as { items: Array<{ productId: string; name: string; price: unknown; quantity?: number }>; shipping: any }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    const email: string | undefined = shipping?.email
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Normalize items and validate minimal fields
    const normalized = items.map(i => ({
      productId: i.productId,
      quantity: typeof i.quantity === 'number' && i.quantity > 0 ? i.quantity : 1,
      price: typeof i.price === 'number' ? i.price : Number(i.price) || 0,
    }))

    // Verify products and stock without an explicit DB transaction to avoid provider timeouts
    const productIds = normalized.map(i => i.productId)
    const products = await prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, stock: true, active: true } })
    const map = new Map(products.map(p => [p.id, p]))
    for (const i of normalized) {
      const p = map.get(i.productId)
      if (!p) return NextResponse.json({ error: 'Invalid product in cart' }, { status: 400 })
      if (!p.active) return NextResponse.json({ error: 'One of the products is inactive' }, { status: 400 })
      if (i.quantity > p.stock) return NextResponse.json({ error: 'Requested quantity exceeds stock' }, { status: 400 })
    }

    // Find or create customer by email (guest checkout)
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name: shipping?.fullName ?? null },
    })

    const subtotal = normalized.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shippingCost = 10
    const tax = Math.round(subtotal * 0.1 * 100) / 100
    const total = subtotal + shippingCost + tax

    const created = await prisma.order.create({
      data: {
        userId: user.id,
        subtotal,
        shippingCost,
        tax,
        total,
        shippingAddress: shipping ?? {},
        items: {
          create: normalized.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
        },
      },
      select: { id: true },
    })

    return NextResponse.json({ orderId: created.id, subtotal, shippingCost, tax, total })
  } catch (error) {
    console.error('Order creation error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Order creation failed', details: message }, { status: 500 })
  }
}


