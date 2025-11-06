'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, User, MapPin, Heart, Settings } from 'lucide-react'

const links = [
  { href: '/account', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/account/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/account/profile', label: 'Profile', icon: User },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '#', label: 'Settings', icon: Settings },
]

export function AccountNav() {
  const pathname = usePathname()
  return (
    <nav className="space-y-0.5">
      {links.map(({ href, label, icon: Icon }) => {
        const active = href !== '#' && (pathname === href || pathname.startsWith(href + '/'))
        const className = active
          ? 'flex items-center gap-3 px-3 py-1.5 rounded-lg bg-muted text-foreground'
          : 'flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground'
        return (
          <Link key={href + label} href={href === '#' ? '#' : href} className={className} aria-current={active ? 'page' : undefined}>
            <Icon className="h-4 w-4" />
            <span className="text-sm">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}


