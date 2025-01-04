import { buttonVariants } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { SkeletonList } from '@/components/ui/skeleton';
import { PortfolioItem } from '@/features/portfolio/components/portfolio-item';
import { getPortfoliosByUser } from '@/features/portfolio/lib/queries';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';

export const SidebarMobilePortfolios = async () => {
  const portfolios = await getPortfoliosByUser();

  if (!portfolios) {
    return (
      <div className="f-col gap-2">
        <p className="ml-0.5 text-sm font-medium text-gray-500">PORTFOLIOS</p>
        <SheetClose asChild>
          <Link
            href="/sign-in"
            className="text-sm text-gray-400 hover:underline"
          >
            Sign in to create portfolios
          </Link>
        </SheetClose>
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className="f-col gap-2">
        <p className="ml-0.5 text-sm font-medium text-gray-500">PORTFOLIOS</p>
        <SheetClose asChild>
          <Link href="/p/new" className={buttonVariants({ size: 'sm' })}>
            Create your first portfolio
          </Link>
        </SheetClose>
      </div>
    );
  }

  return (
    <Suspense fallback={<SkeletonList />}>
      <div className="f-col gap-2">
        <p className="ml-0.5 text-sm font-medium text-gray-500">PORTFOLIOS</p>
        <div className="f-col gap-1">
          {portfolios.map((portfolio) => (
            <SheetClose key={portfolio.id} asChild>
              <Link
                href={`/p/${portfolio.id}`}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'lg' }),
                  'justify-start gap-2 p-1.5 px-2',
                )}
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
