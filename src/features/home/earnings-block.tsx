'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PortfolioImage } from '@/features/portfolio/components/portfolio-image';
import { getPortfolioPositionsByUser } from '@/features/portfolio/lib/queries';
import { StockImage } from '@/features/stock/components/stock-image';
import type { EarningsEvent } from './lib/format-events';

interface Props {
  earnings: EarningsEvent[];
  portfolios?: Awaited<ReturnType<typeof getPortfolioPositionsByUser>>;
}

export const EarningsBlock = ({ earnings, portfolios }: Props) => {
  const symbols = new Set(earnings.map((stock) => stock.symbol));
  const portfoliosWithMatchingOrders = portfolios?.filter(({ positions }) =>
    positions.some(({ stock }) => symbols.has(stock.symbol)),
  );

  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-3 gap-1">
        {earnings.slice(0, Math.min(6, earnings.length)).map((stock) => (
          <div
            key={stock.symbol + 'earnings'}
            className="bg-accent flex w-14 flex-col items-center gap-0.5 rounded-md p-[3px]"
          >
            <StockImage src={stock.image} />
            <Badge
              variant="secondary"
              className="px-1.5 py-0 text-[10px] font-semibold"
            >
              {stock.symbol}
            </Badge>
          </div>
        ))}
      </div>

      {portfoliosWithMatchingOrders?.map(({ id, ...portfolio }) => (
        <div key={id}>
          <Separator />
          <PortfolioImage px={25} portfolio={portfolio} />
        </div>
      ))}
    </div>
  );
};
