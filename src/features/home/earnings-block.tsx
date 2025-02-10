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
            className="bg-accent flex w-14 flex-col items-center gap-0.5 rounded-md p-[3px]"
            key={stock.symbol + 'earnings'}
          >
            <StockImage src={stock.image} />
            <Badge
              className="px-1.5 py-0 text-[10px] font-semibold"
              variant="secondary"
            >
              {stock.symbol}
            </Badge>
          </div>
        ))}
      </div>

      {portfoliosWithMatchingOrders?.map(({ id, ...portfolio }) => (
        <div key={id}>
          <Separator />
          <PortfolioImage portfolio={portfolio} px={25} />
        </div>
      ))}
    </div>
  );
};
