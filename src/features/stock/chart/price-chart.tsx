'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timeframe } from '@/lib/fmp/types/history';
import { HTMLAttributes, useState } from 'react';
import { PriceChartContent } from './price-chart-content';
import { useChartHistory } from './use-chart-history';

interface Props extends HTMLAttributes<HTMLDivElement> {
  symbol: string;
}

const TIME_FRAMES: Timeframe[] = ['1D', '5D', '1M', '6M', '1Y', '5Y', 'All'];

export const PriceChart = ({ symbol, className }: Readonly<Props>) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');

  const { chartData, refetch, isFetched } = useChartHistory({
    symbol,
    timeframe,
  });

  return (
    <div className="f-col gap-5">
      <Tabs className="self-end" defaultValue={timeframe}>
        <TabsList>
          {TIME_FRAMES.map((timeframe) => (
            <TabsTrigger
              value={timeframe}
              key={timeframe}
              onClick={() => setTimeframe(timeframe)}
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
        isLoading={!isFetched}
        isError={false}
        className={className}
      />
    </div>
  );
};
