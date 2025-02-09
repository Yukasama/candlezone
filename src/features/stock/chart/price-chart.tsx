'use client';

import { Button } from '@/components/ui/button';
import { Timeframe } from '@/lib/fmp/types/history';
import { cn } from '@/lib/utils';
import { type HTMLAttributes, useState } from 'react';
import { PriceChartContent } from './price-chart-content';
import { useChartHistory } from './use-chart-history';

interface Props extends HTMLAttributes<HTMLDivElement> {
  symbol: string;
}

const TIME_FRAMES: Timeframe[] = ['1D', '5D', '1M', '6M', '1Y', '5Y', 'All'];

export const PriceChart = ({ symbol, className }: Readonly<Props>) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const { chartData, refetch, isLoading, isError } = useChartHistory({
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
            variant="ghost"
            size="sm"
            key={tf}
            onClick={() => {
              setTimeframe(tf);
            }}
          >
            {tf}
          </Button>
        ))}
      </div>

      <PriceChartContent
        chartData={chartData}
        refetch={refetch}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};
