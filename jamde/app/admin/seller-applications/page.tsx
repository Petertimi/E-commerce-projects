import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { SellerApplicationsTable } from './_components/SellerApplicationsTable'
import prisma from '@/lib/prisma'

type SearchParams = {
  page?: string
  search?: string
  status?: string
}

export default async function SellerApplicationsPage({
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

  const where = {
    ...(search ? {
      OR: [
        { businessName: { contains: search, mode: 'insensitive' as const } },
        { ownerName: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { craftType: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {}),
    ...(status !== 'all' ? { status } : {}),
  }

  const [applications, total] = await Promise.all([
    prisma.sellerApplication.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.sellerApplication.count({ where }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Seller Applications</h1>
        <p className="text-muted-foreground mt-1">View and manage seller applications</p>
      </div>

      <SellerApplicationsTable
        applications={applications}
        currentPage={page}
        totalPages={totalPages}
        total={total}
        search={search}
        status={status}
      />
    </div>
  )
}
