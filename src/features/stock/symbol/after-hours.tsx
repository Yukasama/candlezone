import { getAfterHoursQuote } from '@/lib/fmp/quote/get-after-hours-quote';
import { cn } from '@/lib/utils';
import { ArrowBigDown, ArrowBigUp, SunMoon } from 'lucide-react';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  symbol: string;
  price?: number;
}

export const AfterHours = async ({ symbol, price }: Readonly<Props>) => {
  const localTime = new Date();
  localTime.setHours(localTime.getHours() + 2);
  const hours = localTime.getHours();
  const time = hours + localTime.getMinutes() / 60;

  const isPreMarket = time >= 10 && time < 15.5 && !symbol.includes('.DE');
  const isAfterHours = (hours >= 22 || hours < 1) && !symbol.includes('.DE');
  const showAfterHours = isPreMarket || isAfterHours;

  if (!showAfterHours) {
    return;
  }

  const afterQuote = await getAfterHoursQuote({ symbol });
  if (!afterQuote?.bid || afterQuote.bid === 0) {
    return;
  }

  const changesPercentage = (afterQuote.bid / (price ?? 0) - 1) * 100;
  const positive = changesPercentage >= 0;

  return (
    <div className="bg-faded -mt-1 flex items-center gap-1.5 self-start rounded-full p-[3px] px-2.5 text-[13px]">
      <SunMoon className="size-4" />
      <div className="flex items-center gap-1">
        {afterQuote.bid.toFixed(2) ?? 'N/A'}
        <span className="text-desc mt-[1px] text-[11px]">USD</span>
        {positive ? (
          <ArrowBigUp className="text-price-up size-4" />
        ) : (
          <ArrowBigDown className="text-price-down size-4" />
        )}
        <p className={cn(positive ? 'text-price-up' : 'text-price-down')}>
          {changesPercentage.toFixed(2).replace('-', '') ?? '-'}%
        </p>
      </div>
    </div>
  );
};
