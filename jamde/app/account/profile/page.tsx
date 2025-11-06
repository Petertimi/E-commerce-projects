import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'

const prisma = new PrismaClient()

async function updateProfile(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user) return
  const userId = (session.user as any).id as string
  const name = (formData.get('name') as string)?.trim() || null
  const image = (formData.get('image') as string)?.trim() || null
  await prisma.user.update({ where: { id: userId }, data: { name, image } })
}

export default async function Page() {
  const session = await auth()
  if (!session?.user) return null
  const userId = (session.user as any).id as string
  const user = await prisma.user.findUnique({ where: { id: userId } })
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your profile information</p>
      </div>
      <div className="space-y-6">
      <form action={updateProfile} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Name</label>
          <input name="name" defaultValue={user?.name ?? ''} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Image URL</label>
          <input name="image" defaultValue={user?.image ?? ''} className="w-full border rounded px-3 py-2" />
        </div>
        <button className="px-4 py-2 rounded bg-black text-white">Save</button>
      </form>
      </div>
    </div>
  )
}


