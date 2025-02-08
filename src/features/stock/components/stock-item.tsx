import { Quote } from '@/lib/fmp/types/quote';
import { cn } from '@/lib/utils';
import type { Stock } from '@prisma/client';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import Link from 'next/link';
import type { HTMLAttributes } from 'react';
import { SymbolItem } from './symbol-item';

interface Props extends HTMLAttributes<HTMLDivElement> {
  stock: Pick<Stock, 'symbol' | 'companyName' | 'image'>;
  quote?: Quote;
}

export const StockItem = ({ stock, quote, className }: Readonly<Props>) => {
  if (!stock.symbol) {
    return;
  }

  const positive = (quote?.changesPercentage ?? 0) >= 0;

  return (
    <Link
      href={`/stocks/${stock.symbol}`}
      className={cn(
        'hover:bg-accent flex h-14 items-center justify-between rounded-full bg-gray-50 p-2 pr-5 pl-3 dark:bg-gray-900',
        className,
      )}
    >
      <SymbolItem stock={stock} />
      <div className="flex flex-col items-end text-sm">
        <p className="font-semibold">${quote?.price.toFixed(2) ?? 'N/A'}</p>
        <div className="flex items-center gap-0.5 text-[13px] font-semibold">
          {positive ? (
            <ArrowBigUp size={16} className="text-price-up" />
          ) : (
            <ArrowBigDown size={16} className="text-price-down" />
          )}
          <span className={cn(positive ? 'text-price-up' : 'text-price-down')}>
            {quote?.changesPercentage?.toFixed(2).replace('-', '') ?? 'N/A'}%
          </span>
        </div>
      </div>
    </Link>
  );
};
