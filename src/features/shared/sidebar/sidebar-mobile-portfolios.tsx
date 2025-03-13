import { buttonVariants } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { SkeletonList } from '@/components/ui/skeleton';
import { PortfolioItem } from '@/features/portfolio/components/portfolio-item';
import { getPortfoliosByUser } from '@/features/portfolio/lib/queries';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';
import { SignInButton } from '../sign-in-button';

export const SidebarMobilePortfolios = async () => {
  const portfolios = await getPortfoliosByUser();

  if (!portfolios) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-desc ml-0.5 text-sm font-medium">PORTFOLIOS</p>
        <SheetClose asChild>
          <SignInButton className="text-desc text-sm hover:underline">
            Sign in to create portfolios
          </SignInButton>
        </SheetClose>
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-desc ml-0.5 text-sm font-medium">PORTFOLIOS</p>
        <SheetClose asChild>
          <Link className={buttonVariants({ size: 'sm' })} href="/p/new">
            Create your first portfolio
          </Link>
        </SheetClose>
      </div>
    );
  }

  return (
    <Suspense fallback={<SkeletonList />}>
      <div className="flex flex-col gap-2">
        <p className="text-desc ml-0.5 text-sm font-medium">PORTFOLIOS</p>
        <div className="flex flex-col gap-1">
          {portfolios.map((portfolio) => (
            <SheetClose asChild key={portfolio.id}>
              <Link
                className={cn(
                  buttonVariants({ size: 'lg', variant: 'ghost' }),
                  'justify-start gap-2 p-1.5 px-2',
                )}
                href={`/p/${portfolio.id}`}
              >
                <PortfolioItem portfolio={portfolio} size="sm" />
              </Link>
            </SheetClose>
          ))}
        </div>
      </div>
    </Suspense>
  );
};
