import { Toaster } from '@/components/ui/sonner';
import { Footbar } from '@/features/shared/footbar';
import { Footer } from '@/features/shared/footer';
import { Navbar } from '@/features/shared/navbar';
import { Provider } from '@/features/shared/provider';
import { Sidebar } from '@/features/shared/sidebar';
import { cn } from '@/lib/utils';
import { constructMetadata } from '@/utils/construct-metadata';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import { K2D } from 'next/font/google';
import type { PropsWithChildren } from 'react';
import '../styles/globals.css';

const k2d = K2D({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600'],
});

export const metadata: Metadata = constructMetadata();
// export const runtime = 'edge'

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen antialiased', k2d.className)}>
        <Provider>
          <div>
            <Navbar />
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 overflow-y-auto sm:ml-16">
                {children}
              </main>
            </div>
            <Footer />
            <Footbar />
          </div>
        </Provider>
        <Analytics />
        <SpeedInsights />
        <Toaster />
      </body>

      {/* <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
        strategy="lazyOnload"
        crossOrigin="anonymous"
      /> */}
    </html>
  );
}
