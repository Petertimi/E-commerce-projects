import './globals.css';
import Link from 'next/link';
import { Search, ShoppingCart, User, Twitter, Facebook, Instagram } from 'lucide-react';
import type { ReactNode } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/categories', label: 'Categories' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const socials = [
  { icon: <Twitter className='h-5 w-5' />, href: 'https://twitter.com', label: 'Twitter' },
  { icon: <Facebook className='h-5 w-5' />, href: 'https://facebook.com', label: 'Facebook' },
  { icon: <Instagram className='h-5 w-5' />, href: 'https://instagram.com', label: 'Instagram' },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="border-b py-3 px-4 md:px-6 bg-white/90 sticky top-0 z-10 shadow-sm flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-4">
              <Link href="/" className="font-extrabold text-primary text-lg tracking-tight">Jamde</Link>
            </div>
            <nav className="hidden md:flex gap-6">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="hover:text-primary font-medium text-sm transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex-1 md:max-w-sm mx-2">
              <div className="relative">
                <input type="text" placeholder="Search…" className="w-full rounded-md border px-4 py-1.5 pl-9 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <Link href="/account"><User className="h-5 w-5" /></Link>
              <Link href="/cart"><ShoppingCart className="h-5 w-5" /></Link>
            </div>
          </header>
          <main className="flex-1 bg-muted flex flex-col items-center justify-start px-2 md:px-0">
            {children}
          </main>
          <footer className="border-t py-6 px-6 text-center text-xs text-muted-foreground bg-white/80 flex flex-col md:flex-row justify-between items-center gap-2">
            <div>&copy; {new Date().getFullYear()} Jamde. Built with Next.js & Prisma.</div>
            <nav className="flex gap-6 mb-2 md:mb-0">
              <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary">Terms</Link>
              <Link href="/support" className="hover:text-primary">Support</Link>
            </nav>
            <div className="flex gap-4">
              {socials.map(s => (
                <a href={s.href} key={s.label} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="hover:text-primary">
                  {s.icon}
                </a>
              ))}
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
