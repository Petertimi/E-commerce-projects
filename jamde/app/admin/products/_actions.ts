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

export async function deleteProduct(id: string) {
  await checkAdmin()
  await prisma.product.delete({ where: { id } })
  revalidatePath('/admin/products')
}

export async function bulkDeleteProducts(ids: string[]) {
  await checkAdmin()
  await prisma.product.deleteMany({ where: { id: { in: ids } } })
  revalidatePath('/admin/products')
}

export async function bulkUpdateStatus(ids: string[], active: boolean) {
  await checkAdmin()
  await prisma.product.updateMany({
    where: { id: { in: ids } },
    data: { active },
  })
  revalidatePath('/admin/products')
}

export async function createProduct(formData: FormData) {
  await checkAdmin()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const compareAtPrice = formData.get('compareAtPrice')
    ? parseFloat(formData.get('compareAtPrice') as string)
    : null
  const sku = formData.get('sku') as string | null
  const stock = parseInt(formData.get('stock') as string)
  const categoryId = formData.get('categoryId') as string
  const active = formData.get('active') === 'on'
  const featured = formData.get('featured') === 'on'
  const images = JSON.parse(formData.get('images') as string || '[]') as string[]

  if (!name || !price || !categoryId) {
    throw new Error('Missing required fields')
  }

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  await prisma.product.create({
    data: {
      name,
      slug,
      description: description || null,
      price,
      compareAtPrice,
      sku,
      stock,
      categoryId,
      active,
      featured,
      images,
    },
  })

  revalidatePath('/admin/products')
}

export async function updateProduct(id: string, formData: FormData) {
  await checkAdmin()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const compareAtPrice = formData.get('compareAtPrice')
    ? parseFloat(formData.get('compareAtPrice') as string)
    : null
  const sku = formData.get('sku') as string | null
  const stock = parseInt(formData.get('stock') as string)
  const categoryId = formData.get('categoryId') as string
  const active = formData.get('active') === 'on'
  const featured = formData.get('featured') === 'on'
  const images = JSON.parse(formData.get('images') as string || '[]') as string[]

  if (!name || !price || !categoryId) {
    throw new Error('Missing required fields')
  }

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description: description || null,
      price,
      compareAtPrice,
      sku,
      stock,
      categoryId,
      active,
      featured,
      images,
    },
  })

  revalidatePath('/admin/products')
  revalidatePath(`/products/${slug}`)
}

