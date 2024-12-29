'use client';

import { Badge } from '@/components/ui/badge';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { PortfolioImage } from '@/features/portfolio/components/portfolio-image';
import { getPortfolioPositionsByUser } from '@/features/portfolio/lib/queries';
import { StockImage } from '@/features/stock/components/stock-image';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { formatMarketCap } from '@/lib/utils/stock-helper';
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
    <Drawer>
      <DrawerTrigger asChild>
        <div className="f-col gap-1.5">
          <div className="grid grid-cols-3 gap-1">
            {earnings.slice(0, Math.min(6, earnings.length)).map((stock) => (
              <div
                key={stock.symbol + 'earnings'}
                className="f-col w-14 items-center gap-0.5 rounded-md bg-accent p-[3px]"
              >
                <StockImage src={stock.image} />
                <Badge className="bg-faded px-1.5 py-0 text-[10px] font-semibold text-black dark:text-white">
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
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="hidden">Earnings</DrawerTitle>
        <div>
          {earnings.map((stock) => (
            <div className="f-center gap-3" key={stock.symbol + 'earnings'}>
              <SymbolItem stock={stock} className="w-[200px]" fullLength />
              <div className="f-center gap-3">
                <div>
                  <p className="text-xs text-gray-400">
                    {`EPS ${stock.earningsEps ? '' : '(Est.)'}`}
                  </p>
                  <p className="text-sm font-semibold">
                    <p className="text-sm font-semibold">
                      {stock.earningsEps ?? stock.earningsEpsEstimated ?? '-'}
                    </p>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">
                    {`Revenue ${stock.earningsRevenue ? '' : '(Est.)'}`}
                  </p>
                  <p className="text-sm font-semibold">
                    {stock.earningsRevenue
                      ? formatMarketCap(stock.earningsRevenue)
                      : formatMarketCap(stock.earningsRevenueEstimated)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
