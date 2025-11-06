import Link from 'next/link'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'
import { ShoppingBag, MapPin, Heart } from 'lucide-react'

const prisma = new PrismaClient()

export default async function Page() {
  const session = await auth()
  if (!session?.user) return null
  const userId = (session.user as any).id as string

  const ordersCount = await prisma.order.count({ where: { userId } })

  // Guard for cases where Prisma client wasn't regenerated yet
  const addressesCount = (await (async () => {
    try {
      const addressModel = (prisma as any).address
      if (!addressModel || typeof addressModel.count !== 'function') return 0
      return await addressModel.count({ where: { userId } })
    } catch {
      return 0
    }
  })()) as number

  const wishlist = await (async () => {
    try {
      const wlModel = (prisma as any).wishlist
      if (!wlModel || typeof wlModel.findUnique !== 'function') return null
      return await wlModel.findUnique({ where: { userId } })
    } catch {
      return null
    }
  })()

  const wishlistCount = await (async () => {
    try {
      if (!wishlist) return 0
      const wliModel = (prisma as any).wishlistItem
      if (!wliModel || typeof wliModel.count !== 'function') return 0
      return await wliModel.count({ where: { wishlistId: wishlist.id } })
    } catch {
      return 0
    }
  })()

  // Recent orders (up to 5)
  const recentOrders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, total: true, createdAt: true, status: true, paymentStatus: true },
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {(session.user as any)?.name || 'User'}</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link href="/account/orders" className="rounded-2xl border p-5 hover:shadow-sm transition bg-white">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Total Orders</span>
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div className="mt-2 text-3xl font-bold">{ordersCount}</div>
          </Link>
          <Link href="/account/addresses" className="rounded-2xl border p-5 hover:shadow-sm transition bg-white">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Saved Addresses</span>
              <MapPin className="h-4 w-4" />
            </div>
            <div className="mt-2 text-3xl font-bold">{addressesCount}</div>
          </Link>
          <Link href="/account/wishlist" className="rounded-2xl border p-5 hover:shadow-sm transition bg-white">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Wishlist Items</span>
              <Heart className="h-4 w-4" />
            </div>
            <div className="mt-2 text-3xl font-bold">{wishlistCount}</div>
          </Link>
        </div>

        <div className="space-y-3">
        <h3 className="text-lg font-semibold">Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <div className="rounded-2xl border p-6 text-center text-muted-foreground bg-white">No recent orders</div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((o) => (
              <Link key={o.id} href="/account/orders" className="rounded-2xl border bg-white p-4 flex items-center justify-between hover:shadow-sm transition">
                <div>
                  <div className="font-medium">Order #{o.id.slice(0, 8)}</div>
                  <div className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${o.total.toString()}</div>
                  <div className="text-xs text-muted-foreground">{o.paymentStatus}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}


