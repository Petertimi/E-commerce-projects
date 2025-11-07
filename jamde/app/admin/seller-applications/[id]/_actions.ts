'use server'

import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

async function checkAdmin() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  const role = (session.user as any).role
  if (role !== 'ADMIN') throw new Error('Forbidden')
  return session
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  await checkAdmin()

  const validStatuses = ['PENDING', 'REVIEWED', 'APPROVED', 'REJECTED']
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status')
  }

  await prisma.sellerApplication.update({
    where: { id: applicationId },
    data: { status },
  })

  revalidatePath(`/admin/seller-applications/${applicationId}`)
  revalidatePath('/admin/seller-applications')
}
