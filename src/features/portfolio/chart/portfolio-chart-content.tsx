'use client';

import { Button } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { PortfolioChartData } from '@/features/portfolio/types/history';
import { LastDot } from '@/features/stock/components/last-dot';
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

interface Props {
  chartData?: PortfolioChartData;
  emptyPortfolio: boolean;
  isError: boolean;
  isLoading: boolean;
  refetch: () => void;
}

const chartConfig = {
  totalValue: { label: 'Value' },
} satisfies ChartConfig;

export const PortfolioChartContent = ({
  chartData,
  emptyPortfolio,
  isError,
  isLoading,
  refetch,
}: Props) => {
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <Skeleton className="flex h-[250px] items-center justify-center rounded-xl sm:h-[450px]" />
    );
  }

  if (emptyPortfolio) {
    return (
      <div className="flex h-[250px] items-center justify-center gap-1 sm:h-[450px]">
        <TriangleAlert className="text-desc size-4" />
        <p className="text-desc text-[15px]">No positions added yet.</p>
      </div>
    );
  }

  if (isError || !chartData) {
    return (
      <div className="flex h-[250px] flex-col items-center justify-center gap-2 sm:h-[450px]">
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
      className="aspect-auto h-[250px] sm:h-[450px]"
      config={chartConfig}
    >
      <AreaChart accessibilityLayer data={chartData.results}>
        <defs>
          <linearGradient id="colorValuePositive" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#1de095" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#1de095" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorValueNegative" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#e52b34" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#e52b34" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          axisLine={{ strokeWidth: 0 }}
          dataKey="date"
          interval={Math.floor(chartData.results.length / 10)}
          tickFormatter={(tick, i) => (i === 0 ? '' : tick) as string}
          tickLine={false}
        />
        <YAxis
          axisLine={{ strokeWidth: 0 }}
          domain={chartData.domain}
          interval="preserveStartEnd"
          orientation="right"
          tickCount={8}
          tickFormatter={(value, i) =>
            i === 0 ? '' : Number.parseFloat(value as string).toFixed(1)
          }
          tickLine={false}
          yAxisId="right"
        />
        <ChartTooltip
          content={<ChartTooltipContent indicator="line" />}
          cursor={false}
        />
        <ReferenceLine
          label={{
            fill: '#666',
            fontSize: 12,
            fontWeight: 'bold',
            position: 'top',
            value: `Return: $${chartData.startPrice.toFixed(2)}`,
          }}
          stroke={theme === 'dark' ? '#71717a' : '#3f3f46'}
          strokeDasharray="1 4"
          y={chartData.startPrice}
          yAxisId="right"
        />
        <Area
          dataKey="return"
          dot={(props: DotProps) => (
            <LastDot {...props} chartData={chartData} key={props.key} />
          )}
          fill={`url(#${chartData.positive ? 'colorValuePositive' : 'colorValueNegative'})`}
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
