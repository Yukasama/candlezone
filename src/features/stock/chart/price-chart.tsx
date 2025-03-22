'use client';

import { Button } from '@/components/ui/button';
import { TIME_FRAMES } from '@/lib/fmp/history/time-frame';
import { Timeframe } from '@/lib/fmp/types/history';
import { cn } from '@/lib/utils';
import { type HTMLAttributes, useState } from 'react';
import { PriceChartContent } from './price-chart-content';
import { useChartHistory } from './use-chart-history';

interface Props extends HTMLAttributes<HTMLDivElement> {
  isEuro?: boolean;
  symbol: string;
}

export const PriceChart = ({ className, isEuro, symbol }: Readonly<Props>) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const { chartData, isError, isLoading, refetch } = useChartHistory({
    symbol,
    timeframe,
  });

  return (
    <div className={cn('flex flex-col gap-4 sm:gap-5', className)}>
      <div className="bg-faded flex w-full justify-between gap-1 rounded-full p-[3px] px-1 sm:w-fit sm:self-end lg:p-1 lg:px-1.5">
        {TIME_FRAMES.map((tf) => (
          <Button
            className={cn(
              'h-8 w-full',
              timeframe === tf &&
                'bg-background pointer-events-none rounded-full',
            )}
            key={tf}
            onClick={() => setTimeframe(tf)}
            size="sm"
            variant="ghost"
          >
            {tf}
          </Button>
        ))}
      </div>

      <PriceChartContent
        chartData={chartData}
        isError={isError}
        isEuro={isEuro}
        isLoading={isLoading}
        refetch={refetch}
      />
    </div>
  );
};
