import { CompanyLogo } from '@/components/company-logo';
import { buttonVariants } from '@/components/ui/button';
import { BackButton } from '@/features/auth/back-button';
import { cn } from '@/lib/utils';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { type PropsWithChildren } from 'react';

export default function AuthLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className="bg-background fixed top-0 left-0 z-20 flex h-screen w-screen flex-col xl:grid xl:grid-cols-2">
      <div className="absolute top-5 left-5 flex items-center gap-2">
        <BackButton />
        <Link
          className={cn(
            buttonVariants({ size: 'icon', variant: 'secondary' }),
            'size-9',
          )}
          href="/"
        >
          <Home className="size-4" />
        </Link>
      </div>

      <div className="hidden flex-col items-center justify-center gap-4 xl:flex">
        <Link href="/">
          <CompanyLogo px={200} />
        </Link>
        <div className="flex flex-col items-center gap-0.5">
          <h2 className="text-3xl font-semibold">Zenathra</h2>
          <p className="text-desc">Analyze stocks your way.</p>
        </div>
      </div>

      <div className="mt-20 flex flex-col items-center justify-center xl:mt-0">
        <CompanyLogo className="flex xl:hidden" px={60} />
        {children}
      </div>
    </div>
  );
}
