import './globals.css';
import Link from 'next/link';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import type { ReactNode } from 'react';
import { ToasterProvider } from '@/components/ui/toaster-provider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress ethereum property redefinition errors from browser extensions
              if (typeof window !== 'undefined') {
                // Catch and suppress extension injection errors
                window.addEventListener('error', function(e) {
                  if (e.message && e.message.includes('Cannot redefine property: ethereum')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }, true);
                
                // Also catch unhandled promise rejections from extensions
                window.addEventListener('unhandledrejection', function(e) {
                  if (e.reason && e.reason.message && e.reason.message.includes('Cannot redefine property: ethereum')) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                });
              }
            `,
          }}
        />
      </head>
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
