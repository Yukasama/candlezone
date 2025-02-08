import { AfterHours } from '@/features/stock/symbol/after-hours';
import { getQuote } from '@/lib/fmp/quote/get-quote';
import { cn } from '@/lib/utils';
import type { Stock } from '@prisma/client';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { LastUpdated } from '../symbol/last-updated';

interface Props extends HTMLAttributes<HTMLDivElement> {
  stock: Pick<Stock, 'symbol'>;
}

export const Price = async ({ stock, className }: Readonly<Props>) => {
  const quote = await getQuote({ symbol: stock.symbol });

  if (!quote) {
    return (
      <div
        className={cn('flex flex-col gap-0.5 text-sm text-gray-400', className)}
      >
        <p>Price failed to load.</p>
        <LastUpdated />
      </div>
    );
  }

  const positive = (quote.changesPercentage ?? 0) >= 0;
  const isEUR = stock.symbol.includes('.DE');

  return (
    <div
      className={cn(
        'motion-preset-slide-right-sm flex flex-col gap-[3px]',
        className,
      )}
    >
      <div className="flex items-center gap-1">
        <p className="text-[27px] lg:text-3xl">{quote.price.toFixed(2)}</p>
        <span className="mt-2 text-sm text-gray-400 lg:mt-2.5">
          {isEUR ? 'EUR' : 'USD'}
        </span>
        <div className="mt-[5px] flex items-center gap-0.5">
          {positive ? (
            <ArrowBigUp size={22} className="text-price-up" />
          ) : (
            <ArrowBigDown size={22} className="text-price-down" />
          )}
          <p
            className={cn(
              'text-[18px] lg:text-xl',
              positive ? 'text-price-up' : 'text-price-down',
            )}
          >
            {quote.changesPercentage?.toFixed(2).replace('-', '')}%
          </p>
        </div>
      </div>

      <AfterHours quote={quote} />
      <LastUpdated />
    </div>
  );
};
