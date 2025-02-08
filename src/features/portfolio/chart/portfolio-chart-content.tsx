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
  refetch: () => void;
  isLoading: boolean;
  isError: boolean;
}

const chartConfig = {
  totalValue: { label: 'Value' },
} satisfies ChartConfig;

export const PortfolioChartContent = ({
  chartData,
  emptyPortfolio,
  refetch,
  isLoading,
  isError,
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
        <TriangleAlert className="size-4 text-gray-400" />
        <p className="text-[15px] text-gray-400">No positions added yet.</p>
      </div>
    );
  }

  if (isError || !chartData) {
    return (
      <div className="flex h-[250px] flex-col items-center justify-center gap-2 sm:h-[450px]">
        <div className="flex items-center gap-1">
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
      className="aspect-auto h-[250px] sm:h-[450px]"
    >
      <AreaChart accessibilityLayer data={chartData.results}>
        <defs>
          <linearGradient id="colorValuePositive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1de095" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#1de095" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorValueNegative" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#e52b34" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#e52b34" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={{ strokeWidth: 0 }}
          interval={Math.floor(chartData.results.length / 10)}
          tickFormatter={(tick, i) => (i === 0 ? '' : tick) as string}
        />
        <YAxis
          domain={chartData.domain}
          yAxisId="right"
          orientation="right"
          tickLine={false}
          interval="preserveStartEnd"
          axisLine={{ strokeWidth: 0 }}
          tickCount={8}
          tickFormatter={(value, i) =>
            i === 0 ? '' : Number.parseFloat(value as string).toFixed(1)
          }
        />
        <ChartTooltip
          content={<ChartTooltipContent indicator="line" />}
          cursor={false}
        />
        <ReferenceLine
          y={chartData.startPrice}
          yAxisId="right"
          strokeDasharray="1 4"
          stroke={theme === 'dark' ? '#71717a' : '#3f3f46'}
          label={{
            position: 'top',
            value: `Return: $${chartData.startPrice.toFixed(2)}`,
            fill: '#666',
            fontSize: 12,
            fontWeight: 'bold',
          }}
        />
        <Area
          dataKey="return"
          type="monotone"
          stroke={chartData.positive ? '#1de095' : '#e52b34'}
          fillOpacity={1}
          yAxisId="right"
          fill={`url(#${chartData.positive ? 'colorValuePositive' : 'colorValueNegative'})`}
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
