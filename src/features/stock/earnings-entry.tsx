import { CustomTooltip } from '@/components/custom-tooltip';
import { Card } from '@/components/ui/card';
import { StockImage } from '@/features/stock/components/stock-image';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { cn } from '@/lib/utils';
import { formatMarketCap } from '@/lib/utils/stock-helper';
import { Stock } from '@prisma/client';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Props {
  stock: Pick<
    Stock,
    | 'symbol'
    | 'companyName'
    | 'image'
    | 'mktCap'
    | 'earningsEps'
    | 'earningsEpsEstimated'
    | 'earningsRevenue'
    | 'earningsRevenueEstimated'
  >;
}

export const EarningsEntry = ({ stock }: Props) => {
  return (
    <CustomTooltip
      key={stock.symbol}
      className="rounded-md p-3 pr-4"
      content={
        <div className="space-y-3">
          <SymbolItem stock={stock} size="sm" />
          <div className="text-sm">
            <p className="text-gray-500">MARKET CAP</p>
            <p>{formatMarketCap(stock.mktCap!)}</p>
          </div>
          <div className="text-sm">
            <p className="text-gray-500">EARNINGS (EPS)</p>
            <div>
              <div className="flex gap-2">
                <p className="w-20 text-gray-400">Actual</p>
                <p>{stock.earningsEps ?? 'Not yet released'}</p>
              </div>
              <div className="flex gap-2">
                <p className="w-20 text-gray-400">Estimate</p>
                <p>{stock.earningsEpsEstimated ?? 'N/A'}</p>
              </div>
              {!!stock.earningsEps && (
                <div className="flex gap-2">
                  <p className="w-20 text-gray-400">Surprise</p>
                  <p>{(stock.earningsEpsEstimated ?? 0) / stock.earningsEps}</p>
                </div>
              )}
            </div>
          </div>
          <div className="text-sm">
            <p className="text-gray-500">REVENUE</p>
            <div>
              <div className="flex gap-2">
                <p className="w-20 text-gray-400">Actual</p>
                <p>
                  {stock.earningsRevenue
                    ? formatMarketCap(stock.earningsRevenue)
                    : 'Not yet released'}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="w-20 text-gray-400">Estimate</p>
                <p>
                  {formatMarketCap(stock.earningsRevenueEstimated!) ?? 'N/A'}
                </p>
              </div>
              {!!stock.earningsRevenue && (
                <div className="flex gap-2">
                  <p className="w-20 text-gray-400">Surprise</p>
                  <p>
                    {(stock.earningsRevenueEstimated ?? 0) /
                      stock.earningsRevenue}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      }
    >
      <Card
        className={cn(
          'f-col relative items-center gap-1 rounded-xl p-1 px-3',
          stock.earningsEps
            ? (stock.earningsEpsEstimated ?? 0) / stock.earningsEps >= 0
              ? 'bg-green-500/30'
              : 'bg-red-500/30'
            : 'bg-faded',
        )}
      >
        <div className="rounded-full border bg-accent px-2 text-sm">
          {stock.symbol}
        </div>
        <StockImage src={stock.image} px={43} />
        <Link
          href={`/stocks/${stock.symbol}`}
          className="absolute right-2 top-2 text-gray-400"
        >
          <ExternalLink className="size-4" />
        </Link>
        <div className="flex gap-1">
          <p className="text-sm text-gray-400">Est. EPS</p>
          <p className="text-sm">{stock.earningsEpsEstimated ?? 'N/A'}</p>
        </div>
      </Card>
    </CustomTooltip>
  );
};
