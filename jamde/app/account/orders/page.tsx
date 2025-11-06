import Link from 'next/link'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'

const prisma = new PrismaClient()

export default async function Page() {
  const session = await auth()
  if (!session?.user) return null
  const userId = (session.user as any).id as string

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } },
  })

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Order History</h2>
      {orders.length === 0 ? (
        <div className="rounded border p-6 text-center text-muted-foreground">
          No orders yet. <Link className="underline" href="/products">Browse products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded border p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">Order #{o.id.slice(0, 8)}</div>
                <div className="text-sm text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-sm mb-2">Status: {o.status} • Payment: {o.paymentStatus}</div>
              <div className="text-sm mb-3">Total: ${o.total.toString()}</div>
              <div className="space-y-2">
                {o.items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between text-sm">
                    <div className="truncate pr-2">{it.product.name}</div>
                    <div>x{it.quantity}</div>
                    <div>${it.price.toString()}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


