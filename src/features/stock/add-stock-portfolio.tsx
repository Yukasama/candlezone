'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PortfolioWithQuotes } from '@/features/portfolio/types/portfolio';
import { StockQuote } from '@/features/stock/types/stock';
import { Plus } from 'lucide-react';
import { User } from 'next-auth';
import Link from 'next/link';
import { CreateModal } from '../portfolio/create-modal';
import { AddStockPortfolioItem } from './add-stock-portfolio-item';

interface Props {
  stock?: StockQuote;
  portfolios?: Pick<
    PortfolioWithQuotes,
    'id' | 'title' | 'color' | 'orders' | 'isPublic'
  >[];
  user?: User;
}

export const AddStockPortfolio = ({
  stock,
  portfolios,
  user,
}: Readonly<Props>) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="faded" aria-label="Add stock to portfolio">
          <Plus size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mr-5" side="bottom" sideOffset={6}>
        {user && portfolios?.length ? (
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
        ) : user && !portfolios?.length ? (
          <div className="f-col items-center gap-2">
            Create a portfolio first
            <CreateModal />
          </div>
        ) : (
          <div className="f-col items-center gap-2 p-2">
            <p>Sign in to create portfolios</p>
            <Link className={buttonVariants({ size: 'sm' })} href="/sign-in">
              Sign In
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
