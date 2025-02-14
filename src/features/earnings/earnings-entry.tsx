import { CustomTooltip } from '@/components/custom-tooltip';
import { Card } from '@/components/ui/card';
import { StockImage } from '@/features/stock/components/stock-image';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { EarningsTooltip } from './earnings-tooltip';
import { getCurrentEarnings } from './lib/queries';

interface Props {
  stock: Awaited<ReturnType<typeof getCurrentEarnings>>[number];
}

export const EarningsEntry = ({ stock }: Props) => {
  const earningsColor =
    (stock.earnings?.epsEstimated ?? 0) / (stock.earnings?.epsActual ?? 1) >= 0
      ? 'bg-success/30'
      : 'bg-destructive/30';

  return (
    <CustomTooltip
      className="rounded-md p-3 pr-4"
      content={<EarningsTooltip stock={stock} />}
      key={stock.symbol}
    >
      <Card
        className={cn(
          'relative rounded-xl p-1 px-3',
          stock.earnings?.epsActual ? earningsColor : 'bg-faded',
        )}
      >
        <SymbolItem className="flex xl:hidden" fullLength stock={stock} />
        <div className="hidden flex-col items-center gap-1 xl:flex">
          <div className="bg-accent rounded-full border px-2 text-sm">
            {stock.symbol}
          </div>
          <StockImage px={43} src={stock.image} />
          <div className="flex gap-1">
            <p className="text-desc text-sm">Est. EPS:</p>
            <p className="text-sm">{stock.earnings?.epsEstimated ?? 'N/A'}</p>
          </div>
        </div>
        <Link
          className="text-desc absolute right-2 bottom-2 xl:top-2"
          href={`/stocks/${stock.symbol}`}
        >
          <ExternalLink className="size-4" />
        </Link>
      </Card>
    </CustomTooltip>
  );
};
