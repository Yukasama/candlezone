import { CustomTooltip } from '@/components/custom-tooltip';
import { Card } from '@/components/ui/card';
import { StockImage } from '@/features/stock/components/stock-image';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { cn } from '@/lib/utils';
import type { Stock } from '@prisma/client';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { EarningsTooltip } from './earnings-tooltip';

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
  const earningsColor =
    (stock.earningsEpsEstimated ?? 0) / stock.earningsEps >= 0
      ? 'bg-green-500/30'
      : 'bg-red-500/30';

  return (
    <CustomTooltip
      key={stock.symbol}
      className="rounded-md p-3 pr-4"
      content={<EarningsTooltip stock={stock} />}
    >
      <Card
        className={cn(
          'relative rounded-xl p-1 px-3',
          stock.earningsEps ? earningsColor : 'bg-faded',
        )}
      >
        <SymbolItem className="flex xl:hidden" stock={stock} fullLength />
        <div className="xl:f-col hidden items-center gap-1">
          <div className="rounded-full border bg-accent px-2 text-sm">
            {stock.symbol}
          </div>
          <StockImage src={stock.image} px={43} />
          <div className="flex gap-1">
            <p className="text-sm text-gray-400">Est. EPS:</p>
            <p className="text-sm">{stock.earningsEpsEstimated ?? 'N/A'}</p>
          </div>
        </div>
        <Link
          href={`/stocks/${stock.symbol}`}
          className="absolute bottom-2 right-2 text-gray-400 xl:top-2"
        >
          <ExternalLink className="size-4" />
        </Link>
      </Card>
    </CustomTooltip>
  );
};
