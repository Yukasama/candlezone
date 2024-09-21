import { Quote } from '@/features/stock/types/quote';
import { cn } from '@/lib/utils';
import { Stock } from '@prisma/client';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import Link from 'next/link';
import type { HTMLAttributes } from 'react';
import { SymbolItem } from './symbol-item';

interface Props extends HTMLAttributes<HTMLDivElement> {
  stock: Pick<Stock, 'symbol' | 'companyName' | 'image'>;
  quote?: Quote;
}

export const StockItem = ({ stock, quote, className }: Readonly<Props>) => {
  if (!stock) {
    return;
  }

  const positive = (quote?.changesPercentage ?? 0) >= 0;

  return (
    <Link
      href={`/stocks/${stock.symbol}`}
      className={cn(
        'f-center h-14 justify-between rounded-md bg-background p-2 px-3 hover:bg-background/70',
        className,
      )}
    >
      <SymbolItem stock={stock} />
      <div className="f-col items-end text-sm">
        <p className="font-semibold">${quote?.price?.toFixed(2) ?? 'N/A'}</p>
        <div className="f-center gap-0.5 text-[13px] font-semibold">
          {positive ? (
            <ArrowBigUp size={16} className="text-price-up" />
          ) : (
            <ArrowBigDown size={16} className="text-price-down" />
          )}
          <span className={cn(positive ? 'text-price-up' : 'text-price-down')}>
            {quote?.changesPercentage?.toFixed(2)?.replace('-', '') ?? 'N/A'}%
          </span>
        </div>
      </div>
    </Link>
  );
};
