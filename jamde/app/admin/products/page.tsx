import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { ProductsTable } from './_components/ProductsTable'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const prisma = new PrismaClient()

type SearchParams = {
  page?: string
  search?: string
  status?: string
}

export default async function ProductsPage({
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
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
        { sku: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {}),
    ...(status === 'active' ? { active: true } : status === 'inactive' ? { active: false } : {}),
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: { name: true },
        },
      },
    }),
    prisma.product.count({ where }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  // Convert Decimal prices to numbers
  const productsWithNumbers = products.map((product) => ({
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
  }))

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-muted-foreground mt-1">Manage your product catalog</p>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>

        <ProductsTable
          products={productsWithNumbers}
          currentPage={page}
          totalPages={totalPages}
          total={total}
          search={search}
          status={status}
        />
      </div>
    </div>
  )
}

