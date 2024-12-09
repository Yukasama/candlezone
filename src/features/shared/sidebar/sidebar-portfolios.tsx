import { CustomTooltip } from '@/components/custom-tooltip';
import { Button, buttonVariants } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PortfolioImage } from '@/features/portfolio/components/portfolio-image';
import { PortfolioItem } from '@/features/portfolio/components/portfolio-item';
import { CreateModal } from '@/features/portfolio/create-modal';
import type { Portfolio } from '@prisma/client';
import { Plus } from 'lucide-react';
import { User } from 'next-auth';
import Link from 'next/link';
import { Suspense } from 'react';

interface Props {
  user?: User;
  portfolios?: Pick<Portfolio, 'id' | 'title' | 'color' | 'isPublic'>[];
}

export const SidebarPortfolios = ({ user, portfolios }: Props) => {
  if (!user) {
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

  if (portfolios?.length === 0) {
    return (
      <Dialog>
        <CustomTooltip content="Create portfolio">
          <DialogTrigger asChild>
            <Button size="small-icon" aria-label="Create portfolio">
              <Plus className="size-4" />
            </Button>
          </DialogTrigger>
        </CustomTooltip>
        <Suspense>
          <CreateModal />
        </Suspense>
      </Dialog>
    );
  }

  return (
    <div className="f-col items-center gap-1">
      {portfolios?.map((portfolio) => (
        <CustomTooltip
          key={portfolio.id}
          content={
            <Link href={`/p/${portfolio.id}`}>
              <PortfolioItem portfolio={portfolio} className="pr-2" size="sm" />
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
  );
};
