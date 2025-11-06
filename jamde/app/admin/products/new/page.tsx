import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { ProductForm } from '../_components/ProductForm'

const prisma = new PrismaClient()

export default async function NewProductPage() {
  const session = await auth()
  if (!session?.user) redirect('/api/auth/signin')
  
  const role = (session.user as any).role
  if (role !== 'ADMIN') {
    return <div className="p-8 text-center">Access Denied. Admin only.</div>
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create New Product</h1>
          <p className="text-muted-foreground mt-1">Add a new product to your catalog</p>
        </div>
        <ProductForm categories={categories} />
      </div>
    </div>
  )
}

