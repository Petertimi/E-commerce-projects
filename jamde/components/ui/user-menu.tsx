'use client'

import Link from 'next/link'
import { User } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { signOut } from 'next-auth/react'

type UserInfo = { name?: string | null; email?: string | null }

export function UserMenu({ user }: { user?: UserInfo }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button aria-label="Account" className="h-9 rounded-full border flex items-center gap-2 px-3 hover:bg-muted transition">
          <User className="h-5 w-5" />
          {user?.name ? (
            <span className="text-sm max-w-[12rem] truncate">{user.name}</span>
          ) : null}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={8} className="min-w-[240px] rounded-md border bg-white p-1 shadow-md">
          {(user?.name || user?.email) ? (
            <div className="px-2 py-2">
              {user?.name ? <div className="text-sm font-medium leading-tight">{user.name}</div> : null}
              {user?.email ? <div className="text-xs text-muted-foreground leading-tight">{user.email}</div> : null}
            </div>
          ) : null}
          <DropdownMenu.Separator className="h-px bg-muted my-1" />
          <DropdownMenu.Item asChild>
            <Link href="/account" className="px-2 py-2 text-sm rounded hover:bg-muted block">Dashboard</Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link href="/account/profile" className="px-2 py-2 text-sm rounded hover:bg-muted block">Profile</Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link href="/account/addresses" className="px-2 py-2 text-sm rounded hover:bg-muted block">Addresses</Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-px bg-muted my-1" />
          <DropdownMenu.Item asChild>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left px-2 py-2 text-sm rounded hover:bg-red-50 text-red-600">Sign out</button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}


