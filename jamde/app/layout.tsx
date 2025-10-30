import './globals.css';
import Link from 'next/link';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 bg-muted flex flex-col items-center justify-start px-2 md:px-0">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
