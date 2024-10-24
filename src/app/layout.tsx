import { Toaster } from '@/components/ui/sonner';
import { Footbar } from '@/features/shared/footer/footbar';
import { Footer } from '@/features/shared/footer/footer';
import { Navbar } from '@/features/shared/navbar';
import { Provider } from '@/features/shared/provider';
import { Sidebar } from '@/features/shared/sidebar/sidebar';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import localFont from 'next/font/local';
import type { PropsWithChildren } from 'react';
import { constructMetadata } from '../lib/metadata';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata = constructMetadata();

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen font-sans antialiased',
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <Provider>
          <div className="overflow-hidden">
            <Navbar />
            <div className="mt-16 flex min-h-screen">
              <Sidebar />
              <main className="flex-1 overflow-auto sm:ml-16">{children}</main>
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
