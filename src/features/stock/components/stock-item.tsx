import { Quote } from '@/lib/fmp/types/quote';
import { cn } from '@/lib/utils';
import type { Stock } from '@prisma/client';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import Link from 'next/link';
import type { HTMLAttributes } from 'react';
import { SymbolItem } from './symbol-item';

interface Props extends HTMLAttributes<HTMLDivElement> {
  quote?: Quote;
  stock: Pick<Stock, 'companyName' | 'image' | 'symbol'>;
}

export const StockItem = ({ className, quote, stock }: Readonly<Props>) => {
  if (!stock.symbol) {
    return;
  }

  const positive = (quote?.changesPercentage ?? 0) >= 0;

  return (
    <Link
      className={cn(
        'hover:bg-accent bg-faded flex h-14 items-center justify-between rounded-full p-2 pr-5 pl-3',
        className,
      )}
      href={`/stocks/${stock.symbol}`}
    >
      <SymbolItem stock={stock} />
      <div className="flex flex-col items-end text-sm">
        <p className="font-semibold">${quote?.price.toFixed(2) ?? 'N/A'}</p>
        <div className="flex items-center gap-0.5 text-[13px] font-semibold">
          {positive ? (
            <ArrowBigUp className="text-price-up" size={16} />
          ) : (
            <ArrowBigDown className="text-price-down" size={16} />
          )}
          <span className={cn(positive ? 'text-price-up' : 'text-price-down')}>
            {quote?.changesPercentage?.toFixed(2).replace('-', '') ?? 'N/A'}%
          </span>
        </div>
      </div>
    </Link>
  );
};
