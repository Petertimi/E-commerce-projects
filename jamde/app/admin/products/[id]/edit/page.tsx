import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { ProductForm } from '../../_components/ProductForm'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

export default async function EditProductPage({
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

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { category: true },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ])

  if (!product) {
    notFound()
  }

  // Convert Decimal to number
  const productWithNumbers = {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
  }

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground mt-1">Update product information</p>
        </div>
        <ProductForm product={productWithNumbers} categories={categories} />
      </div>
    </div>
  )
}

