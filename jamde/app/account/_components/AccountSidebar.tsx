'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  User,
  MapPin,
  Heart,
  ArrowLeft,
} from 'lucide-react'

const navItems = [
  { href: '/account', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/account/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/account/profile', label: 'Profile', icon: User },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
]

export function AccountSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r z-50 lg:z-auto">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <Link href="/account" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="font-bold text-xl">My Account</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Store</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}

