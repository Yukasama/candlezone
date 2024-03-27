import Provider from "@/components/shared/provider";
import { Metadata } from "next";
import { cn, constructMetadata } from "@/lib/utils";
import { K2D } from "next/font/google";
import type { PropsWithChildren } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/shared/navbar";
import "./globals.css";
import Script from "next/script";
import { env } from "@/env.mjs";
import { Toaster } from "@/components/ui/sonner";
import Footbar from "@/components/shared/footbar";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const Footer = dynamic(() => import("@/components/shared/footer"));

const k2d = K2D({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600"],
});

export const metadata: Metadata = constructMetadata();
// export const runtime = "edge";

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider session={session}>
        <body
          className={cn(
            "antialiased min-h-screen overflow-hidden",
            k2d.className,
          )}
        >
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
        </body>

        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </SessionProvider>
    </html>
  );
}
