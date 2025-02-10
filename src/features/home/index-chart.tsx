'use client';

import { Button } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { getIndexes } from '@/features/home/actions/get-indexes';
import { useQuery } from '@tanstack/react-query';
import { RotateCcw, TriangleAlert } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { IndexChartTooltip } from './index-chart-tooltip';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ffbf00'];

const chartConfig = {
  '^DJI': { label: 'Dow Jones', color: COLORS[0] },
  '^IXIC': { label: 'NASDAQ 100', color: COLORS[1] },
  '^GSPC': { label: 'S&P 500', color: COLORS[2] },
  IAU: { label: 'Gold (USD)', color: COLORS[3] },
} satisfies ChartConfig;

export const IndexChart = () => {
  const symbols = Object.keys(chartConfig);
  const { data, refetch, isLoading, isError } = useQuery({
    queryFn: async () => await getIndexes({ symbols }),
    queryKey: ['get-indexes'],
    staleTime: 1000 * 60 * 1,
  });

  if (isLoading) {
    return (
      <Skeleton className="flex h-[280px] items-center justify-center rounded-lg sm:h-[350px]" />
    );
  }

  if (isError || !data || data.length === 0) {
    return (
      <div className="flex h-[280px] flex-col items-center justify-center gap-2 rounded-lg sm:h-[350px]">
        <div className="flex items-center gap-1">
          <TriangleAlert className="text-desc size-4" />
          <p className="text-desc text-[15px]">Chart failed to load.</p>
        </div>
        <Button size="icon-sm" onClick={() => refetch()}>
          <RotateCcw className="size-4" />
          Try again
        </Button>
      </div>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[280px] rounded-lg sm:h-[350px]"
    >
      <LineChart data={data} margin={{ left: -16 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          fontSize={12}
          tickLine={false}
          axisLine={{ strokeWidth: 0 }}
          interval={Math.floor(data.length / 6)}
        />
        <YAxis
          tickLine={false}
          axisLine={{ strokeWidth: 0 }}
          fontSize={12}
          tickFormatter={(value: number) =>
            typeof value === 'number' ? `${value.toFixed(1)}%` : '0%'
          }
        />
        <ChartTooltip
          content={<IndexChartTooltip active={false} />}
          cursor={false}
          defaultIndex={1}
        />
        <ChartLegend content={<ChartLegendContent />} />
        {symbols.map((symbol, i) => (
          <Line
            key={symbol}
            type="monotone"
            connectNulls
            dataKey={symbol}
            stroke={COLORS[i % COLORS.length]}
            isAnimationActive={false}
            strokeWidth={2}
            dot={false}
            name={chartConfig[symbol as keyof typeof chartConfig].label}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
};
