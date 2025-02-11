'use client';

import { Button } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { RotateCcw, TriangleAlert } from 'lucide-react';
import { useTheme } from 'next-themes';
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
import { ChartData } from '../types/history';
import { PriceChartTooltip } from './price-chart-tooltip';

interface Props {
  chartData?: ChartData;
  isError: boolean;
  isLoading: boolean;
  refetch: () => void;
}

const chartConfig = {
  close: { label: 'Close' },
  date: { label: 'Date' },
} satisfies ChartConfig;

const classNames = 'h-[250px] sm:h-[450px]';

export const PriceChartContent = ({
  chartData,
  isError,
  isLoading,
  refetch,
}: Props) => {
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <Skeleton
        className={cn(
          'flex items-center justify-center rounded-xl',
          classNames,
        )}
      />
    );
  }

  if (isError || !chartData?.startPrice) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2',
          classNames,
        )}
      >
        <div className="flex items-center gap-1">
          <TriangleAlert className="text-desc size-4" />
          <p className="text-desc text-[15px]">Chart failed to load.</p>
        </div>
        <Button onClick={() => refetch()} size="icon-sm">
          <RotateCcw className="size-4" />
          Try again
        </Button>
      </div>
    );
  }

  return (
    <ChartContainer
      className={cn('aspect-ratio max-w-full', classNames)}
      config={chartConfig}
    >
      <AreaChart data={chartData.results}>
        <defs>
          <linearGradient id="colorClose" x1="0" x2="0" y1="0" y2="1">
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
          axisLine={{ strokeWidth: 0.5 }}
          dataKey="date"
          fontSize={12}
          interval={Math.floor(chartData.results.length / 8)}
          tickFormatter={(tick, i) => (i === 0 ? '' : tick) as string}
          tickLine={false}
        />
        <YAxis
          axisLine={{ strokeWidth: 0.5 }}
          domain={chartData.domain}
          fontSize={12}
          interval="preserveStartEnd"
          orientation="right"
          tickCount={8}
          tickFormatter={(value, i) =>
            i === 0 ? '' : `$${Number.parseFloat(value as string).toFixed(1)}`
          }
          tickLine={false}
          yAxisId="right"
        />
        <ChartTooltip
          content={
            <PriceChartTooltip
              active={false}
              chartData={chartData}
              label=""
              payload={[]}
            />
          }
          cursor={false}
        />
        <ReferenceLine
          label={{
            fill: '#666',
            fontSize: 12,
            fontWeight: 'bold',
            position: 'top',
            value: `Price: $${chartData.startPrice.toFixed(2)}`,
          }}
          stroke={theme === 'dark' ? '#71717a' : '#3f3f46'}
          strokeDasharray="1 4"
          y={chartData.startPrice}
          yAxisId="right"
        />
        <ReferenceLine
          label={{
            fill: chartData.positive ? '#1de095' : '#e52b34',
            fontSize: 12,
            position: 'right',
            value: String(chartData.results.at(-1)?.close.toFixed(2)),
          }}
          stroke={chartData.positive ? '#1de095' : '#e52b34'}
          strokeDasharray="3 3"
          y={chartData.results.at(-1)?.close}
          yAxisId="right"
        />
        <Area
          dataKey="close"
          dot={(props: DotProps) => (
            <LastDot {...props} chartData={chartData} key={props.key} />
          )}
          fill="url(#colorClose)"
          fillOpacity={1}
          isAnimationActive={false}
          stroke={chartData.positive ? '#1de095' : '#e52b34'}
          strokeWidth={2}
          type="monotone"
          yAxisId="right"
        />
      </AreaChart>
    </ChartContainer>
  );
};
