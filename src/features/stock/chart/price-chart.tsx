'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      <Tabs className="sm:self-end" defaultValue={timeframe}>
        <TabsList className="w-full justify-between sm:w-fit">
          {TIME_FRAMES.map((timeframe) => (
            <TabsTrigger
              value={timeframe}
              className="w-full"
              key={timeframe}
              onClick={() => {
                setTimeframe(timeframe);
              }}
              aria-label={`View ${timeframe} timeframe`}
            >
              {timeframe}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <PriceChartContent
        chartData={chartData}
        refetch={refetch}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};
