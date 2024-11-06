import { getAfterHoursQuote } from '@/lib/fmp/quote/get-after-hours-quote';
import { Quote } from '@/lib/fmp/types/quote';
import { cn } from '@/lib/utils';
import { ArrowBigDown, ArrowBigUp, SunMoon } from 'lucide-react';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  quote: Pick<Quote, 'symbol' | 'price'>;
}

export const AfterHours = async ({ quote }: Readonly<Props>) => {
  const localTime = new Date();
  localTime.setHours(localTime.getHours() + 2);

  const hours = localTime.getHours();
  const time = hours + localTime.getMinutes() / 60;

  const isPreMarket =
    time >= 10 && time < 15.5 && !quote.symbol.includes('.DE');
  const isAfterHours =
    (hours >= 22 || hours < 1) && !quote.symbol.includes('.DE');
  const showAfterHours = isPreMarket || isAfterHours;

  if (!showAfterHours) {
    return;
  }

  const afterQuote = await getAfterHoursQuote({ symbol: quote.symbol });
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
