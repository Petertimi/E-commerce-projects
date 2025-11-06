import { ReactNode } from 'react'
import Link from 'next/link'
import { auth } from '@/auth'
import { AccountNav } from './_components/AccountNav'

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  const displayName = session?.user?.name || 'User'
  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-[220px,1fr] gap-6 items-start">
        <aside className="border rounded-2xl p-3 h-fit sticky top-6 bg-white shadow-sm">
          <AccountNav />
        </aside>
        <main className="px-6">
          <div className="max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}


