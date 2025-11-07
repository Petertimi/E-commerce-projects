import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { SellerApplicationDetail } from './_components/SellerApplicationDetail'
import prisma from '@/lib/prisma'

export default async function SellerApplicationDetailPage({
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

  const application = await prisma.sellerApplication.findUnique({
    where: { id },
  })

  if (!application) {
    notFound()
  }

  return (
    <div className="p-6">
      <SellerApplicationDetail application={application} />
    </div>
  )
}
