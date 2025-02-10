import { getAfterHoursQuote } from '@/lib/fmp/quote/get-after-hours-quote';
import { Quote } from '@/lib/fmp/types/quote';
import { cn } from '@/lib/utils';
import { ArrowBigDown, ArrowBigUp, SunMoon } from 'lucide-react';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  quote: Pick<Quote, 'price' | 'symbol'>;
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
  if (!afterQuote?.bid || afterQuote.bid === 0 || !quote.price) {
    return;
  }

  const changesPercentage = (afterQuote.bid / quote.price - 1) * 100;
  const positive = changesPercentage >= 0;

  return (
    <div className="bg-faded -mt-1 flex items-center gap-1.5 self-start rounded-full p-[3px] px-2.5 text-[13px]">
      <SunMoon className="size-4" />
      <div className="flex items-center gap-1">
        {afterQuote.bid.toFixed(2)}
        <span className="text-desc mt-[1px] text-[11px]">USD</span>
        {positive ? (
          <ArrowBigUp className="text-price-up size-4" />
        ) : (
          <ArrowBigDown className="text-price-down size-4" />
        )}
        <p className={cn(positive ? 'text-price-up' : 'text-price-down')}>
          {changesPercentage.toFixed(2).replace('-', '')}%
        </p>
      </div>
    </div>
  );
};
