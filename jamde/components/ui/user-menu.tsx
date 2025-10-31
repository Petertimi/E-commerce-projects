'use client'

import Link from 'next/link'
import { User } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { signOut } from 'next-auth/react'

export function UserMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button aria-label="Account" className="h-9 w-9 rounded-full border flex items-center justify-center hover:bg-muted transition">
          <User className="h-5 w-5" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={8} className="min-w-[200px] rounded-md border bg-white p-1 shadow-md">
          <DropdownMenu.Item asChild>
            <Link href="/account" className="px-2 py-2 text-sm rounded hover:bg-muted block">Account</Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link href="/account/orders" className="px-2 py-2 text-sm rounded hover:bg-muted block">Orders</Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-px bg-muted my-1" />
          <DropdownMenu.Item asChild>
            <button onClick={() => signOut()} className="w-full text-left px-2 py-2 text-sm rounded hover:bg-red-50 text-red-600">Sign out</button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}


