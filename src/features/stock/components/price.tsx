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

export const Price = async ({ className, stock }: Readonly<Props>) => {
  const quote = await getQuote({ symbol: stock.symbol });
  const positive = (quote?.changesPercentage ?? 0) >= 0;
  const isEUR = stock.symbol.includes('.DE');

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const price = quote?.price?.toFixed(2) ?? 'N/A';

  return (
    <div
      className={cn(
        'motion-preset-slide-right-sm flex flex-col gap-[3px]',
        className,
      )}
    >
      <div className="flex items-center gap-1">
        <p className="text-[27px] lg:text-3xl">{price}</p>
        <span className="text-desc mt-2 text-sm lg:mt-2.5">
          {isEUR ? 'EUR' : 'USD'}
        </span>
        <div className="mt-[5px] flex items-center gap-0.5">
          {positive ? (
            <ArrowBigUp className="text-price-up" size={22} />
          ) : (
            <ArrowBigDown className="text-price-down" size={22} />
          )}
          <p
            className={cn(
              'text-[18px] lg:text-xl',
              positive ? 'text-price-up' : 'text-price-down',
            )}
          >
            {quote?.changesPercentage?.toFixed(2).replace('-', '') ?? '-'}%
          </p>
        </div>
      </div>

      <AfterHours price={quote?.price} symbol={stock.symbol} />
      <LastUpdated />
    </div>
  );
};
