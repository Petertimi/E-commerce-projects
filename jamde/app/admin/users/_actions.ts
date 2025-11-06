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

export async function updateUserRole(userId: string, role: string) {
  await checkAdmin()

  const validRoles = ['CUSTOMER', 'ADMIN']
  if (!validRoles.includes(role)) {
    throw new Error('Invalid role')
  }

  // Prevent removing the last admin
  if (role === 'CUSTOMER') {
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })
    const user = await prisma.user.findUnique({ where: { id: userId } })
    
    if (user?.role === 'ADMIN' && adminCount === 1) {
      throw new Error('Cannot remove the last admin user')
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: role as any },
  })

  revalidatePath(`/admin/users/${userId}`)
  revalidatePath('/admin/users')
}

export async function deleteUser(userId: string) {
  await checkAdmin()

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw new Error('User not found')
  }

  // Prevent deleting the last admin
  if (user.role === 'ADMIN') {
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })
    if (adminCount === 1) {
      throw new Error('Cannot delete the last admin user')
    }
  }

  await prisma.user.delete({ where: { id: userId } })

  revalidatePath('/admin/users')
}

