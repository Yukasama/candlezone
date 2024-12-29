'use client';

import { Loader } from '@/components/loader';
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
  ReferenceLine,
  XAxis,
  YAxis,
  type DotProps,
} from 'recharts';
import { LastDot } from '../components/last-dot';
import { ChartData } from '../types/history';
import { PriceChartTooltip } from './price-chart-tooltip';

interface Props {
  chartData?: ChartData;
  refetch: () => void;
  isLoading: boolean;
  isError: boolean;
}

const chartConfig = {
  date: { label: 'Date' },
  close: { label: 'Close' },
} satisfies ChartConfig;

const classNames = 'h-[250px] sm:h-[450px]';

export const PriceChartContent = ({
  chartData,
  refetch,
  isLoading,
  isError,
}: Props) => {
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <Skeleton className={cn('f-box rounded-xl', classNames)}>
        <Loader size={40} />
      </Skeleton>
    );
  }

  if (isError || !chartData) {
    return (
      <div className={cn('f-col f-box items-center gap-2', classNames)}>
        <div className="f-center gap-1">
          <TriangleAlert className="size-4 text-gray-400" />
          <p className="text-[15px] text-gray-400">Chart failed to load.</p>
        </div>
        <Button
          size="icon-sm"
          onClick={() => {
            refetch();
          }}
        >
          <RotateCcw className="size-4" />
          Try again
        </Button>
      </div>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className={cn('aspect-ratio max-w-full', classNames)}
    >
      <AreaChart data={chartData.results}>
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
          interval={Math.floor(chartData.results.length / 8)}
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
            i === 0 ? '' : `$${Number.parseFloat(value as string).toFixed(1)}`
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
        <ReferenceLine
          y={chartData.results.at(-1)?.close}
          yAxisId="right"
          stroke={chartData.positive ? '#1de095' : '#e52b34'}
          strokeDasharray="3 3"
          label={{
            value: String(chartData.results.at(-1)?.close.toFixed(2)),
            position: 'right',
            fill: chartData.positive ? '#1de095' : '#e52b34',
            fontSize: 12,
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
  );
};
