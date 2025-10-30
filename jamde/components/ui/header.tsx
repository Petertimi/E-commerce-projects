import Link from 'next/link';
import { Search } from 'lucide-react';
import { CartBadge } from './cart-badge';

export function Header() {
  return (
    <header className="w-full border-b bg-white/90 sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
      {/* Left: Brand and Catalog link */}
      <div className="flex items-center gap-8">
        <Link href="/" className="font-black text-2xl tracking-tight">Jamde</Link>
        <Link href="/products" className="text-base font-medium text-muted-foreground hover:text-primary px-4 py-2 rounded-lg transition">Products Catalog</Link>
      </div>

      {/* Center: Large Search Bar */}
      <div className="flex-1 flex justify-center px-8">
        <form className="w-full max-w-xl relative">
          <input
            type="search"
            placeholder="Search products..."
            className="w-full border rounded-lg py-2 pl-10 pr-4 text-base focus:ring-2 focus:ring-primary shadow focus:outline-none bg-white"
            autoComplete="off"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </form>
      </div>

      {/* Right: Cart and Sign In */}
      <div className="flex items-center gap-6">
        <CartBadge />
        <button className="px-6 py-2 rounded bg-black text-white text-base font-medium hover:bg-primary/90 transition">Sign In</button>
      </div>
    </header>
  );
}
