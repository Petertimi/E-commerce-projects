import './globals.css';
import Link from 'next/link';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import type { ReactNode } from 'react';
import { ToasterProvider } from '@/components/ui/toaster-provider';

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
        <ToasterProvider />
      </body>
    </html>
  );
}
