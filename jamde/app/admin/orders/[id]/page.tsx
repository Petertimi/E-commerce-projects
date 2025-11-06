import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { OrderDetail } from './_components/OrderDetail'

const prisma = new PrismaClient()

export default async function OrderDetailPage({
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

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
              price: true,
            },
          },
        },
      },
    },
  })

  if (!order) {
    notFound()
  }

  // Convert Decimal to numbers
  const orderWithNumbers = {
    ...order,
    total: Number(order.total),
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    shippingCost: Number(order.shippingCost),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
      product: {
        ...item.product,
        price: Number(item.product.price),
      },
    })),
  }

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-6xl mx-auto">
        <OrderDetail order={orderWithNumbers} />
      </div>
    </div>
  )
}

