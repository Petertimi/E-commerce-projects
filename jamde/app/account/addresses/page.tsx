import {type Address } from '@prisma/client'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Star, Trash2 } from 'lucide-react'
import prisma from '@/lib/prisma'

async function createAddress(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user) return
  const userId = (session.user as any).id as string
  const isDefault = formData.get('isDefault') === 'on'
  const fullName = (formData.get('fullName') as string) || ''
  const addressLine1 = (formData.get('streetAddress') as string) || ''
  const city = (formData.get('city') as string) || ''
  const country = (formData.get('country') as string) || ''
  
  // Validate required fields
  if (!fullName || !addressLine1 || !city || !country) {
    console.error('Missing required address fields')
    return
  }
  
  const data = {
    fullName,
    addressLine1,
    city,
    state: (formData.get('state') as string) || null,
    postalCode: (formData.get('postalCode') as string) || null,
    country,
    isDefault: false,
  }
  try {
    if (isDefault) {
      // First, unset all other defaults
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } })
      data.isDefault = true
    }
    await prisma.address.create({ data: { ...data, userId } })
    revalidatePath('/account/addresses')
  } catch (error) {
    console.error('Error creating address:', error)
    // Re-throw to let the form handle the error
    throw error
  }
}

async function deleteAddress(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user) return
  const id = formData.get('id') as string
  try {
    await prisma.address.delete({ where: { id } })
    revalidatePath('/account/addresses')
  } catch (error) {
    console.error('Error deleting address:', error)
    throw error
  }
}

async function setDefault(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user) return 
  const userId = (session.user as any).id as string
  const id = formData.get('id') as string
  try {
    await prisma.$transaction([
      prisma.address.updateMany({ where: { userId }, data: { isDefault: false } }),
      prisma.address.update({ where: { id }, data: { isDefault: true } }),
    ])
    revalidatePath('/account/addresses')
  } catch (error) {
    console.error('Error setting default address:', error)
    throw error
  }
}

export default async function Page() {
  const session = await auth()
  if (!session?.user) return null
  const userId = (session.user as any).id as string
  const addresses: Address[] = await (async () => {
    try {
      return await prisma.address.findMany({ where: { userId }, orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }] })
    } catch (error: any) {
      console.error('Error fetching addresses:', error)
      // If it's a connection error, return empty array gracefully
      if (error?.code === 'P1001' || error?.name === 'PrismaClientInitializationError') {
        console.error('Database connection error. Please check your DATABASE_URL and ensure the database is running.')
        return [] as Address[]
      }
      return [] as Address[]
    }
  })()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Addresses</h1>
        <p className="text-muted-foreground mt-1">Manage your shipping addresses</p>
      </div>
      <div className="space-y-6">
        <div className="rounded border p-6 bg-white">
        <h3 className="font-medium mb-4">Add Address</h3>
        <form action={createAddress} className="space-y-4">
          <input name="fullName" placeholder="Full name" className="w-full border rounded px-3 py-2" required />
          <input name="streetAddress" placeholder="Enter street address" className="w-full border rounded px-3 py-2" required />
          <input name="city" placeholder="Enter city" className="w-full border rounded px-3 py-2" required />
          <input name="state" placeholder="Enter state" className="w-full border rounded px-3 py-2" />
          <input name="postalCode" placeholder="Enter postal code" className="w-full border rounded px-3 py-2" />
          <input name="country" placeholder="Enter country" className="w-full border rounded px-3 py-2" required />
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isDefault" id="isDefault" className="w-4 h-4" />
            <label htmlFor="isDefault" className="text-sm">Set as default address</label>
          </div>
          <button type="submit" className="px-4 py-2 rounded bg-black text-white">Add address</button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Addresses</h2>
        {addresses.length === 0 ? (
          <div className="rounded border p-6 text-center text-muted-foreground bg-white">
            No saved addresses yet. Add one above.
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((a: Address) => (
              <div key={a.id} className="rounded border p-4 bg-white flex items-start justify-between">
                <div className="flex-1">
                  {a.fullName && <div className="text-sm font-medium mb-1">{a.fullName}</div>}
                  <div className="text-sm font-medium">{a.addressLine1}</div>
                  <div className="text-sm text-muted-foreground">
                    {a.city}{a.state ? `, ${a.state}` : ''} {a.postalCode || ''}
                  </div>
                  <div className="text-sm text-muted-foreground">{a.country}</div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <form action={setDefault}>
                    <input type="hidden" name="id" value={a.id} />
                    <button type="submit" className="p-1 hover:bg-muted rounded">
                      {a.isDefault ? (
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <Star className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </form>
                  <form action={deleteAddress}>
                    <input type="hidden" name="id" value={a.id} />
                    <button type="submit" className="p-1 hover:bg-muted rounded text-red-600">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}


