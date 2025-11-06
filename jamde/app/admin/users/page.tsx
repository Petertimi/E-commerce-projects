import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { UsersTable } from './_components/UsersTable'

const prisma = new PrismaClient()

type SearchParams = {
  page?: string
  search?: string
  role?: string
}

export default async function UsersPage({
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
  const roleFilter = searchParams.role || 'all'

  const where = {
    ...(search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {}),
    ...(roleFilter !== 'all' ? { role: roleFilter as any } : {}),
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage customers and admin users</p>
        </div>

        <UsersTable
          users={users}
          currentPage={page}
          totalPages={totalPages}
          total={total}
          search={search}
          role={roleFilter}
        />
      </div>
    </div>
  )
}

