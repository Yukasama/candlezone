import { buttonVariants } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { PortfolioItem } from '@/features/portfolio/components/portfolio-item';
import { cn } from '@/lib/utils';
import type { Portfolio } from '@prisma/client';
import { User } from 'next-auth';
import Link from 'next/link';

interface Props {
  user?: User;
  portfolios?: Pick<Portfolio, 'id' | 'title' | 'color' | 'isPublic'>[];
}

export const SidebarMobilePortfolios = ({ user, portfolios }: Props) => {
  if (!user) {
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

  if (portfolios?.length === 0) {
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
    <div className="f-col gap-2">
      <p className="ml-0.5 text-sm font-medium text-gray-500">PORTFOLIOS</p>
      <div className="f-col gap-1">
        {portfolios?.map((portfolio) => (
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
  );
};
