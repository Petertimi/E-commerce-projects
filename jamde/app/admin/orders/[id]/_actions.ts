'use server'

import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

async function checkAdmin() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  const role = (session.user as any).role
  if (role !== 'ADMIN') throw new Error('Forbidden')
  return session
}

export async function updateOrderStatus(orderId: string, status: string) {
  await checkAdmin()

  const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status')
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as any },
  })

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/orders')
}

export async function processRefund(orderId: string) {
  await checkAdmin()

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  })

  if (!order) {
    throw new Error('Order not found')
  }

  if (order.paymentStatus !== 'PAID') {
    throw new Error('Order is not paid, cannot refund')
  }

  if (order.status === 'REFUNDED' || order.status === 'CANCELLED') {
    throw new Error('Order is already refunded or cancelled')
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'REFUNDED',
      paymentStatus: 'REFUNDED',
    },
  })

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/orders')
}

