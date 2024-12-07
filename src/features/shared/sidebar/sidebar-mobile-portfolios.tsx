import { buttonVariants } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { PortfolioItem } from '@/features/portfolio/components/portfolio-item';
import { cn } from '@/lib/utils';
import type { Portfolio } from '@prisma/client';
import { User } from 'next-auth';
import Link from 'next/link';

interface Props {
  user: User;
  portfolios: Pick<Portfolio, 'id' | 'title' | 'color' | 'isPublic'>[];
}

export const SidebarMobilePortfolios = ({ user, portfolios }: Props) => {
  if (!user) {
    return (
      <SheetClose asChild>
        <Link
          href="/sign-in"
          className="text-center text-sm text-gray-400 hover:underline"
        >
          Sign in to create portfolios
        </Link>
      </SheetClose>
    );
  }

  if (portfolios.length === 0) {
    return (
      <SheetClose asChild>
        <Link href="/p/new" className={buttonVariants({ size: 'sm' })}>
          Create your first portfolio
        </Link>
      </SheetClose>
    );
  }

  return (
    <div className="f-col gap-2">
      <p className="text-sm font-medium text-gray-500">PORTFOLIOS</p>
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
