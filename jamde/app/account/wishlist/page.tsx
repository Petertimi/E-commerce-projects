import Link from 'next/link'
import Image from 'next/image'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'

const prisma = new PrismaClient()

async function ensureWishlist(_formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user) return
  const userId = (session.user as any).id as string
  try {
    const model = (prisma as any).wishlist
    if (!model) return
    const existing = await model.findUnique({ where: { userId } })
    if (!existing) await model.create({ data: { userId } })
  } catch {
    // ignore when client not generated yet
  }
}

async function removeItem(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user) return
  const id = formData.get('id') as string
  await prisma.wishlistItem.delete({ where: { id } })
}

export default async function Page() {
  const session = await auth()
  if (!session?.user) return null
  const userId = (session.user as any).id as string

  const wishlist = await (async () => {
    try {
      const model = (prisma as any).wishlist
      if (!model || typeof model.findUnique !== 'function') return null
      return await model.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } },
      })
    } catch {
      return null
    }
  })()

  if (!wishlist) {
    // Render CTA to initialize wishlist
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Wishlist</h1>
          <p className="text-muted-foreground mt-1">Save products you love</p>
        </div>
        <div className="space-y-6">
          <div className="rounded border p-6 text-center bg-white">
            <p className="mb-4 text-muted-foreground">No wishlist yet. Create one to save products you love.</p>
            <form action={ensureWishlist}>
              <button className="px-4 py-2 rounded bg-black text-white">Create wishlist</button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const items = (wishlist?.items ?? []) as any[]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Wishlist</h1>
        <p className="text-muted-foreground mt-1">Your saved products</p>
      </div>
      <div className="space-y-6">
      {items.length === 0 ? (
        <div className="rounded border p-6 text-center text-muted-foreground">
          Your wishlist is empty. <Link className="underline" href="/products">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((it) => (
            <div key={it.id} className="rounded border p-4 flex gap-4 items-center">
              <div className="w-16 h-16 relative rounded overflow-hidden bg-muted flex-shrink-0">
                {it.product.images?.[0] ? (
                  <Image src={it.product.images[0]} alt={it.product.name} fill className="object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${it.product.slug}`} className="font-medium hover:underline truncate block">{it.product.name}</Link>
                <div className="text-sm text-muted-foreground">${it.product.price.toString()}</div>
              </div>
              <form action={removeItem}>
                <input type="hidden" name="id" value={it.id} />
                <button className="px-3 py-1 border rounded">Remove</button>
              </form>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}


