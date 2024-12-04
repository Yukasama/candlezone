'use client';

import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { PortfolioImage } from '@/features/portfolio/components/portfolio-image';
import { getPortfoliosWithOrdersByUser } from '@/features/portfolio/lib/queries';
import { StockImage } from '@/features/stock/components/stock-image';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { EarningsData } from '@/lib/fmp/types/info';
import { formatMarketCap } from '@/lib/utils/stock-helper';
import Link from 'next/link';

interface Props {
  earnings: EarningsData[];
  portfolios: Awaited<ReturnType<typeof getPortfoliosWithOrdersByUser>>;
}

export const EarningsBlock = ({ earnings, portfolios }: Props) => {
  console.log(earnings);
  const symbols = earnings.map((stock) => stock.symbol);
  const portfoliosWithMatchingOrders = portfolios?.filter(({ orders }) =>
    orders.some(({ stock }) => symbols.includes(stock.symbol)),
  );

  return (
    earnings.length > 0 && (
      <Drawer>
        <DrawerTrigger className="f-col bg-faded gap-1.5" asChild>
          <div className="flex gap-2">
            {earnings.slice(0, Math.min(6, earnings.length)).map((stock) => (
              <Link
                key={stock.symbol + 'earnings'}
                href={`/stocks/${stock.symbol}`}
                className="f-col w-14 items-center rounded-md bg-accent p-1"
              >
                <StockImage src={stock.image} />
                <Badge className="bg-faded mt-1 px-1.5 py-0 text-[10px] font-semibold text-black dark:text-white">
                  {stock.symbol}
                </Badge>
              </Link>
            ))}
          </div>

          {portfoliosWithMatchingOrders?.map(({ id, ...portfolio }) => (
            <div key={id}>
              <Separator />
              <PortfolioImage px={25} portfolio={portfolio} />
            </div>
          ))}
        </DrawerTrigger>
        <DrawerContent className="f-col -mb-2 gap-1.5 px-2 pt-1">
          <Separator />
          {earnings.map((stock) => (
            <div className="f-center gap-3" key={stock.symbol + 'earnings'}>
              <SymbolItem stock={stock} className="w-[200px]" fullLength />
              <div className="f-center gap-3">
                <div>
                  <p className="text-xs text-gray-400">
                    {`EPS ${stock.earningsEps ? '' : '(Est.)'}`}
                  </p>
                  <p className="text-sm font-semibold">
                    {stock.earningsEps
                      ? stock.earningsEps
                      : (stock.earningsEpsEstimated ?? '-')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">
                    {`Revenue ${stock.earningsRevenue ? '' : '(Est.)'}`}
                  </p>
                  <p className="text-sm font-semibold">
                    {stock.earningsRevenue
                      ? formatMarketCap(stock.earningsRevenue)
                      : (formatMarketCap(stock.earningsRevenueEstimated) ??
                        '-')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </DrawerContent>
      </Drawer>
    )
  );
};
