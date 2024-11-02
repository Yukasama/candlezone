import { Toaster } from '@/components/ui/sonner';
import { Footer } from '@/features/shared/footer';
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
          'font-sans antialiased',
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <Provider>
          <div className="flex">
            <Sidebar />
            <div className="w-full sm:w-[calc(100%-64px)]">
              <Navbar />
              <main className="min-h-screen overflow-y-auto">{children}</main>
              <Footer />
            </div>
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
