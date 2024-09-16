import { buttonVariants } from '@/components/ui/button';
import { PortfolioWithQuotes } from '@/features/portfolio/types/portfolio';
import { AddStockPortfolio } from '@/features/stock/add-stock-portfolio';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { StockQuote } from '@/features/stock/types/stock';
import { cn } from '@/lib/utils';
import { ArrowBigDown, ArrowBigUp, ExternalLink } from 'lucide-react';
import { User } from 'next-auth';
import Link from 'next/link';

interface Props {
  stock: StockQuote;
  portfolios: PortfolioWithQuotes[];
  user?: User;
}

export const DashboardStockCard = ({ stock, portfolios, user }: Props) => {
  return (
    <div
      key={stock.symbol + 2}
      className="f-col gap-3 rounded-md border bg-background p-4"
    >
      <div className="f-center justify-between gap-1">
        <Link href={`/stocks/${stock.symbol}`}>
          <SymbolItem stock={stock} />
        </Link>
        <div className="f-col items-end">
          <p className="text-[15px] font-medium">${stock?.price?.toFixed(2)}</p>
          <div className="f-center gap-0.5 text-sm font-medium">
            {(stock?.changesPercentage ?? 0) > 0 ? (
              <ArrowBigUp size={16} className="text-price-up" />
            ) : (
              <ArrowBigDown size={16} className="text-price-down" />
            )}
            <span
              className={cn(
                (stock?.changesPercentage ?? 0) > 0
                  ? 'text-price-up'
                  : 'text-price-down',
              )}
            >
              {stock?.changesPercentage?.toFixed(2).replace('-', '')}%
            </span>
          </div>
        </div>
      </div>
      <div className="hidden justify-between md:flex">
        <div className="flex gap-4 text-sm md:gap-6">
          <div className="f-col">
            <p className="text-xs text-gray-400">Sector</p>
            {stock.sector}
          </div>
          <div className="f-col">
            <p className="text-xs text-gray-400">P/E Ratio</p>
            {stock.peRatioTTM?.toFixed(2)}
          </div>
        </div>
        <div className="flex items-end gap-2">
          <AddStockPortfolio
            stock={stock}
            portfolios={portfolios}
            user={user}
          />
          <Link
            className={buttonVariants({
              variant: 'mythic',
              size: 'small-icon',
            })}
            aria-label="View stock"
            href={`/stocks/${stock.symbol}`}
          >
            <ExternalLink size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
