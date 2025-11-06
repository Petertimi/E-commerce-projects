import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { OrdersTable } from './_components/OrdersTable'
import Link from 'next/link'

const prisma = new PrismaClient()

type SearchParams = {
  page?: string
  search?: string
  status?: string
  paymentStatus?: string
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const session = await auth()
  if (!session?.user) redirect('/api/auth/signin')
  
  const role = (session.user as any).role
  if (role !== 'ADMIN') {
    return <div className="p-8 text-center">Access Denied. Admin only.</div>
  }

  const page = Math.max(1, parseInt(searchParams.page || '1'))
  const pageSize = 20
  const skip = (page - 1) * pageSize
  const search = searchParams.search || ''
  const status = searchParams.status || 'all'
  const paymentStatus = searchParams.paymentStatus || 'all'

  const where = {
    ...(search ? {
      OR: [
        { id: { contains: search, mode: 'insensitive' as const } },
        { user: { 
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        } },
      ],
    } : {}),
    ...(status !== 'all' ? { status: status as any } : {}),
    ...(paymentStatus !== 'all' ? { paymentStatus: paymentStatus as any } : {}),
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        items: {
          include: {
            product: {
              select: { name: true, images: true },
            },
          },
        },
      },
    }),
    prisma.order.count({ where }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  // Convert Decimal to numbers
  const ordersWithNumbers = orders.map((order) => ({
    ...order,
    total: Number(order.total),
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    shippingCost: Number(order.shippingCost),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  }))

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground mt-1">Process and manage customer orders</p>
        </div>

        <OrdersTable
          orders={ordersWithNumbers}
          currentPage={page}
          totalPages={totalPages}
          total={total}
          search={search}
          status={status}
          paymentStatus={paymentStatus}
        />
      </div>
    </div>
  )
}

