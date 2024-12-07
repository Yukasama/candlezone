'use client';

import { buttonVariants } from '@/components/ui/button';
import { PortfolioWithQuotes } from '@/features/portfolio/types/portfolio';
import { StockQuote } from '@/features/stock/types/stock';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Suspense } from 'react';
import { CreateModal } from '../portfolio/create-modal';
import { AddStockPortfolioItem } from './add-stock-portfolio-item';

interface Props {
  stock?: StockQuote;
  portfolios?: Pick<
    PortfolioWithQuotes,
    'id' | 'title' | 'color' | 'orders' | 'isPublic'
  >[];
}

export const AddStockPortfolioContent = ({
  stock,
  portfolios,
}: Readonly<Props>) => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="f-col items-center gap-2 p-2">
        <p>Sign in to create portfolios</p>
        <Link className={buttonVariants({ size: 'sm' })} href="/sign-in">
          Sign In
        </Link>
      </div>
    );
  }

  if (portfolios?.length === 0) {
    return (
      <div className="f-col items-center gap-2">
        Create a portfolio first
        <Suspense>
          <CreateModal />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="f-col gap-1">
      {stock &&
        portfolios?.map((portfolio) => (
          <AddStockPortfolioItem
            key={portfolio.id}
            portfolio={portfolio}
            stock={stock}
          />
        ))}
    </div>
  );
};
