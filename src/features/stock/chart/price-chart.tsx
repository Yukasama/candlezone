'use client';

import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timeframe } from '@/lib/fmp/types/history';
import { cn } from '@/lib/utils';
import { RotateCcw, TriangleAlert } from 'lucide-react';
import { useTheme } from 'next-themes';
import { HTMLAttributes, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  type DotProps,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import { LastDot } from '../components/last-dot';
import { PriceChartTooltip } from './price-chart-tooltip';
import { useChartHistory } from './use-chart-history';

interface Props extends HTMLAttributes<HTMLDivElement> {
  symbol: string;
}

const TIME_FRAMES: Timeframe[] = ['1D', '5D', '1M', '6M', '1Y', '5Y', 'All'];

const chartConfig = {
  date: { label: 'Date' },
  close: { label: 'Close' },
} satisfies ChartConfig;

export const PriceChart = ({ symbol, className }: Readonly<Props>) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');

  const { theme } = useTheme();
  const { chartData, refetch, isFetched } = useChartHistory({
    symbol,
    timeframe,
  });

  return (
    <div className="f-col gap-3">
      <Tabs className="self-end" defaultValue={timeframe}>
        <TabsList>
          {TIME_FRAMES.map((timeframe) => (
            <TabsTrigger
              value={timeframe}
              key={timeframe}
              onClick={() => setTimeframe(timeframe)}
              aria-label={`${timeframe} view`}
            >
              {timeframe}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className={cn('f-box h-[250px] w-full sm:h-[450px]', className)}>
        {isFetched ? (
          chartData ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-full w-full"
            >
              <AreaChart data={chartData.results} margin={{ right: -18 }}>
                <defs>
                  <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={chartData.positive ? '#1de095' : '#e52b34'}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartData.positive ? '#1de095' : '#e52b34'}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ strokeWidth: 0.5 }}
                  interval={Math.floor(chartData.results.length / 10)}
                  tickFormatter={(tick, i) => (i === 0 ? '' : tick) as string}
                />
                <YAxis
                  domain={chartData.domain}
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  interval="preserveStartEnd"
                  axisLine={{ strokeWidth: 0.5 }}
                  tickCount={8}
                  fontSize={12}
                  tickFormatter={(value, i) =>
                    i === 0 ? '' : Number.parseFloat(value as string).toFixed(1)
                  }
                />
                <ChartTooltip
                  content={
                    <PriceChartTooltip
                      active={false}
                      payload={[]}
                      label=""
                      chartData={chartData}
                    />
                  }
                  cursor={false}
                />
                <ReferenceLine
                  y={chartData.startPrice}
                  yAxisId="right"
                  strokeDasharray="1 4"
                  stroke={theme === 'dark' ? '#71717a' : '#3f3f46'}
                  label={{
                    position: 'top',
                    value: `Price: $${chartData.startPrice.toFixed(2)}`,
                    fill: '#666',
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}
                />
                <Area
                  dataKey="close"
                  type="monotone"
                  stroke={chartData.positive ? '#1de095' : '#e52b34'}
                  fillOpacity={1}
                  yAxisId="right"
                  fill="url(#colorClose)"
                  isAnimationActive={false}
                  strokeWidth={2}
                  dot={(props: DotProps) => (
                    <LastDot {...props} key={props.key} chartData={chartData} />
                  )}
                />
              </AreaChart>
            </ChartContainer>
          ) : (
            <div className="f-col items-center gap-2">
              <div className="f-center gap-1">
                <TriangleAlert className="size-4 text-gray-400" />
                <p className="text-[15px] text-gray-400">
                  Chart failed to load.
                </p>
              </div>
              <Button size="icon-sm" onClick={() => refetch()}>
                <RotateCcw className="size-4" />
                Try again
              </Button>
            </div>
          )
        ) : (
          <Skeleton className="f-box f-col h-[250px] w-full items-center rounded-xl sm:h-full">
            <Loader size={40} />
            Loading Data...
            <small className="text-[13px] text-gray-400">
              Gathering data, almost there!
            </small>
          </Skeleton>
        )}
      </div>
    </div>
  );
};
