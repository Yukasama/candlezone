import { Provider } from '@/components/provider'
import { Toaster } from '@/components/ui/sonner'
import { env } from '@/env.mjs'
import { Footbar } from '@/features/shared/footbar'
import { Footer } from '@/features/shared/footer'
import { Navbar } from '@/features/shared/navbar'
import { auth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { constructMetadata } from '@/utils/construct-metadata'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { K2D } from 'next/font/google'
import Script from 'next/script'
import type { PropsWithChildren } from 'react'
import '../styles/globals.css'

const k2d = K2D({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600'],
})

export const metadata: Metadata = constructMetadata()
// export const runtime = 'edge'

export default async function RootLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen overflow-hidden antialiased',
          k2d.className,
        )}
      >
        <SessionProvider session={session}>
          <Provider>
            <div className="h-screen overflow-auto">
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <Footbar />
            </div>
          </Provider>
          <Analytics />
          <SpeedInsights />
          <Toaster />
        </SessionProvider>
      </body>

      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
    </html>
  )
}
