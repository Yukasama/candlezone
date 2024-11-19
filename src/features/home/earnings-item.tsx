import { CustomTooltip } from '@/components/custom-tooltip';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PortfolioImage } from '@/features/portfolio/components/portfolio-image';
import { StockImage } from '@/features/stock/components/stock-image';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { formatMarketCap } from '@/lib/utils/stock-helper';
import { Stock } from '@prisma/client';
import Link from 'next/link';
import { getPortfoliosWithOrdersByUser } from '../portfolio/lib/queries';

interface Props {
  stock: Pick<
    Stock,
    | 'symbol'
    | 'companyName'
    | 'image'
    | 'earningsEpsEstimated'
    | 'earningsRevenueEstimated'
    | 'earningsRevenue'
    | 'earningsEps'
    | 'image'
  >;
  portfolios?: Awaited<ReturnType<typeof getPortfoliosWithOrdersByUser>>;
}

export const EarningsItem = ({ stock, portfolios }: Props) => {
  return (
    <CustomTooltip
      className="rounded-lg"
      content={
        <div className="f-col gap-1">
          <SymbolItem stock={stock} fullLength />
          <Separator className="my-0.5 bg-gray-200 dark:bg-gray-700" />
          <div className="flex gap-3">
            <div>
              <p className="text-[13px] text-gray-400">Est. EPS</p>
              <p className="text-sm">{stock.earningsEpsEstimated ?? '-'}</p>
              <p className="mt-2 text-[13px] text-gray-400">Actual EPS</p>
              <p className="text-sm font-semibold">
                {stock.earningsEps ?? 'Not released yet.'}
              </p>
            </div>
            <div>
              <p className="text-[13px] text-gray-400">Est. Revenue</p>
              <p className="text-sm font-semibold">
                {stock.earningsRevenueEstimated
                  ? formatMarketCap(stock.earningsRevenueEstimated)
                  : '-'}
              </p>
              <p className="mt-2 text-[13px] text-gray-400">Actual Revenue</p>
              <p className="text-sm font-semibold">
                {stock.earningsRevenue
                  ? formatMarketCap(stock.earningsRevenue)
                  : 'Not released yet.'}
              </p>
            </div>
          </div>
        </div>
      }
    >
      <Link
        href={`/stocks/${stock.symbol}`}
        className="f-col bg-faded items-center rounded-lg border p-1 px-2"
        key={stock.symbol + 'earnings'}
      >
        <div className="f-center min-h-14 gap-1.5">
          <StockImage src={stock.image} />
          <div className="grid grid-rows-2 gap-0.5">
            {portfolios?.map(
              ({ orders, ...portfolio }) =>
                orders.filter((order) => order.stock.symbol === stock.symbol)
                  .length > 0 && (
                  <PortfolioImage
                    key={portfolio.id + stock.symbol}
                    px={25}
                    portfolio={portfolio}
                  />
                ),
            )}
          </div>
        </div>
        <Badge variant="secondary" className="text-xs font-semibold">
          {stock.symbol}
        </Badge>
      </Link>
    </CustomTooltip>
  );
};
