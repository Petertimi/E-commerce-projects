import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { UserDetail } from './_components/UserDetail'

const prisma = new PrismaClient()

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/api/auth/signin')
  
  const role = (session.user as any).role
  if (role !== 'ADMIN') {
    return <div className="p-8 text-center">Access Denied. Admin only.</div>
  }

  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          paymentStatus: true,
          total: true,
          createdAt: true,
        },
      },
      addresses: {
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          orders: true,
          addresses: true,
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  // Convert Decimal to numbers
  const userWithNumbers = {
    ...user,
    orders: user.orders.map((order) => ({
      ...order,
      total: Number(order.total),
    })),
  }

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-6xl mx-auto">
        <UserDetail user={userWithNumbers} />
      </div>
    </div>
  )
}

