'use client';

import { buttonVariants } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError() {
  return (
    <html lang="en">
      <body className="bg-background">
        <div className="mt-[300px] flex flex-col items-center gap-3">
          <div className="flex flex-col gap-3">
            <h2 className="text-4xl">That should&apos;nt have happened</h2>
            <p className="text-desc">
              It looks like something went wrong on our side.
            </p>
          </div>
          <Link
            className={buttonVariants({ size: 'lg', variant: 'secondary' })}
            href="/"
          >
            <Home size={18} />
            Go to Home
          </Link>
        </div>
      </body>
    </html>
  );
}
