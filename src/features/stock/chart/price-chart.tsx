'use client';

import { Loader } from '@/components/loader';
import { LastDot } from '@/components/stock/last-dot';
import { Button } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timeframe } from '@/config/fmp';
import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';
import { useTheme } from 'next-themes';
import { HTMLAttributes, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import { PriceChartTooltip } from './price-chart-tooltip';
import { useChartHistory } from './use-chart-history';

interface Props extends HTMLAttributes<HTMLDivElement> {
  symbol: string;
}

const TIME_FRAMES: Timeframe[] = ['1D', '5D', '1M', '6M', '1Y', '5Y', 'All'];

const chartConfig = {
  date: {
    label: 'Date',
  },
  close: {
    label: 'Close',
  },
} satisfies ChartConfig;

export const PriceChart = ({ symbol, className }: Readonly<Props>) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');

  const { theme } = useTheme();
  const { chartData, refetch, isFetched } = useChartHistory({
    symbol,
    timeframe,
  });

  return (
    <div className={cn('f-col gap-3', className)}>
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

      {isFetched ? (
        chartData ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full sm:h-[450px]"
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
              <CartesianGrid
                horizontal
                stroke={theme === 'dark' ? '#18181b' : '#f4f4f5'}
                vertical={false}
              />
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
                  value: `Return: ${chartData.startPrice.toFixed(2)}$`,
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
                dot={(props) => <LastDot {...props} chartData={chartData} />}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="f-box f-col mt-20 gap-2">
            <p className="text-gray-400">Chart failed to load.</p>
            <Button size="sm" onClick={() => refetch()}>
              <RotateCcw size={18} />
              Refetch
            </Button>
          </div>
        )
      ) : (
        <div className="f-col f-box bg-faded aspect-auto h-[250px] w-full animate-pulse rounded-md sm:h-[450px]">
          <Loader />
          Loading Data...
          <small className="text-[13px] text-gray-400">
            Gathering data, almost there!
          </small>
        </div>
      )}
    </div>
  );
};
