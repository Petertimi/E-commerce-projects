import React from "react";
import Link from "next/link";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg">Inkmystle</Link>
          {/* Placeholder for search and nav */}
          <div className="flex space-x-4">
            <input className="border px-2 py-1 rounded" type="search" placeholder="Search products..." />
            <nav>
              <Link href="/products" className="text-sm px-2 hover:underline">Products</Link>
              <Link href="/cart" className="text-sm px-2 hover:underline">Cart</Link>
              <Link href="/account" className="text-sm px-2 hover:underline">Account</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-gray-50">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
          <span className="text-xs text-gray-500">&copy; 2025 Inkmystle Store</span>
          <div className="flex gap-2 mt-2 md:mt-0">
            <Link href="#" className="text-xs text-gray-500 hover:underline">Privacy</Link>
            <Link href="#" className="text-xs text-gray-500 hover:underline">Terms</Link>
            <Link href="#" className="text-xs text-gray-500 hover:underline">Contact</Link>
            {/* Social Icons can be added later */}
          </div>
        </div>
      </footer>
    </div>
  );
}
