import { ReactNode } from 'react'
import { AdminSidebar } from './_components/AdminSidebar'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/api/auth/signin')
  
  const role = (session.user as any).role
  if (role !== 'ADMIN') {
    return <div className="p-8 text-center">Access Denied. Admin only.</div>
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  )
}

