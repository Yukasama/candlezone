import { CustomTooltip } from '@/components/custom-tooltip';
import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PortfolioImage } from '@/features/portfolio/components/portfolio-image';
import { PortfolioItem } from '@/features/portfolio/components/portfolio-item';
import { CreatePortfolioModal } from '@/features/portfolio/create-portfolio-modal';
import { getPortfoliosByUser } from '@/features/portfolio/lib/queries';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export const SidebarPortfolios = async () => {
  const portfolios = await getPortfoliosByUser();

  if (!portfolios) {
    return (
      <CustomTooltip content="Sign in to create a portfolio">
        <Link
          href="/sign-in"
          aria-label="Sign in to create a portfolio"
          className={buttonVariants({ size: 'small-icon' })}
        >
          <Plus className="size-4" />
        </Link>
      </CustomTooltip>
    );
  }

  if (portfolios.length === 0) {
    return (
      <Suspense>
        <CreatePortfolioModal numberOfPortfolios={portfolios.length}>
          <CustomTooltip content="Create portfolio">
            <Button size="small-icon" aria-label="Create portfolio" asChild>
              <Plus className="size-4" />
            </Button>
          </CustomTooltip>
        </CreatePortfolioModal>
      </Suspense>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={'skeleton' + String(i)}
              className="h-14 w-full rounded-full"
            />
          ))}
        </div>
      }
    >
      <div className="flex flex-col items-center gap-1">
        {portfolios.map((portfolio) => (
          <CustomTooltip
            key={portfolio.id}
            content={
              <Link href={`/p/${portfolio.id}`}>
                <PortfolioItem
                  portfolio={portfolio}
                  className="pr-2"
                  size="sm"
                />
              </Link>
            }
          >
            <Link
              href={`/p/${portfolio.id}`}
              prefetch={true}
              className={buttonVariants({ variant: 'ghost', size: 'icon' })}
            >
              <PortfolioImage portfolio={portfolio} px={25} />
            </Link>
          </CustomTooltip>
        ))}
      </div>
    </Suspense>
  );
};
