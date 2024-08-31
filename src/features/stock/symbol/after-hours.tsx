import { cn } from '@/lib/utils';
import { AfterHoursQuote, Quote } from '@/types/stock';
import { ArrowBigDown, ArrowBigUp, SunMoon } from 'lucide-react';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  quote: Pick<Quote, 'price' | 'changesPercentage'>;
  afterQuote?: Pick<AfterHoursQuote, 'price'>;
}

export const AfterHours = ({ quote, afterQuote }: Readonly<Props>) => {
  if (!afterQuote?.price || !quote.price) {
    return;
  }

  const changesPercentage = (afterQuote.price / quote.price - 1) * 100;
  const positive = changesPercentage >= 0;

  return (
    <div className="f-center gap-1.5 text-[15px]">
      <SunMoon size={18} />
      <div className="f-center gap-1">
        {afterQuote?.price?.toFixed(2)}
        <span className="mt-0.5 text-[12px] text-gray-400">USD</span>
        {positive ? (
          <ArrowBigUp size={18} className="text-price-up" />
        ) : (
          <ArrowBigDown size={18} className="text-price-down" />
        )}
        <p className={cn(positive ? 'text-price-up' : 'text-price-down')}>
          {changesPercentage.toFixed(2).replace('-', '')}%
        </p>
      </div>
    </div>
  );
};
