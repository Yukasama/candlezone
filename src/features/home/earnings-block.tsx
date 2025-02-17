'use client';

import { StockCard } from '@/app/stock-card';
import { Separator } from '@/components/ui/separator';
import { PortfolioImage } from '@/features/portfolio/components/portfolio-image';
import { getPortfolioPositionsByUser } from '@/features/portfolio/lib/queries';
import { NewOrderModal } from '../order/new-order-modal';
import { EarningsEvent } from './types/events';

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
      <div className="grid grid-cols-2 gap-1">
        {earnings.slice(0, Math.min(4, earnings.length)).map((stock) => (
          <div
            className="bg-faded flex w-full gap-2 rounded-md p-1.5 px-3"
            key={stock.symbol + 'earnings'}
          >
            <div className="flex flex-col gap-1.5">
              <StockCard asLink stock={stock} width={210} />
              <Separator />
              <div className="grid grid-cols-2 items-center gap-2 text-sm">
                <div>
                  <p className="text-desc">EPS (E)</p>
                  <p>{stock.earnings?.epsEstimated?.toFixed(2) ?? '-'}</p>
                </div>
                <div>
                  <p className="text-desc">Revenue (E)</p>
                  <p>{stock.earnings?.revenueEstimated?.toFixed(2) ?? '-'}</p>
                </div>
              </div>
            </div>
            <div>
              {(portfoliosWithMatchingOrders?.length ?? 0) > 0 ? (
                portfoliosWithMatchingOrders?.map(({ id, ...portfolio }) => (
                  <div key={id}>
                    <PortfolioImage portfolio={portfolio} px={25} />
                  </div>
                ))
              ) : (
                <NewOrderModal stock={stock} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
