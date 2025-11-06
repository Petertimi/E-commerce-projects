import Link from 'next/link';
import { Search } from 'lucide-react';
import { CartBadge } from './cart-badge';
import { auth } from '@/auth';
import { UserMenu } from './user-menu';
import HeaderSearch from './header-search';

export async function Header() {
  const session = await auth();
  return (
    <header className="w-full border-b bg-white/90 sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
      {/* Left: Brand and Catalog link */}
      <div className="flex items-center gap-8">
        <Link href="/" className="font-black text-2xl tracking-tight">Jamde</Link>
        <Link href="/products" className="text-base font-medium text-muted-foreground hover:text-primary px-4 py-2 rounded-lg transition">Products Catalog</Link>
      </div>

      {/* Center: Large Search Bar */}
      <div className="flex-1 flex justify-center px-8">
        {/* Client-side search to ensure navigation always includes q */}
        {/* eslint-disable-next-line @next/next/no-async-client-component */}
        <HeaderSearch />
      </div>

      {/* Right: Cart and Sign In */}
      <div className="flex items-center gap-6">
        <CartBadge />
        {session?.user ? (
          <UserMenu user={{ name: session.user.name ?? null, email: session.user.email ?? null }} />
        ) : (
          <Link href="/api/auth/signin" className="px-6 py-2 rounded bg-black text-white text-base font-medium hover:bg-primary/90 transition">Sign In</Link>
        )}
      </div>
    </header>
  );
}
