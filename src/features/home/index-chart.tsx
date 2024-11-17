'use client';

import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { getIndexes } from '@/features/home/actions/get-indexes';
import { useQuery } from '@tanstack/react-query';
import { RotateCcw, TriangleAlert } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

const chartConfig = {
  '^GSPC': { label: 'S&P 500' },
  '^IXIC': { label: 'NASDAQ 100' },
  '^DJI': { label: 'Dow Jones' },
  IAU: { label: 'Gold (USD)' },
} satisfies ChartConfig;

export const IndexChart = () => {
  const symbols = Object.keys(chartConfig);
  const { data, refetch, isLoading, isError } = useQuery({
    queryFn: async () => await getIndexes({ symbols }),
    queryKey: ['get-indexes'],
  });

  return (
    <div className="f-box h-[250px] w-full sm:h-[325px]">
      {isLoading ? (
        <Skeleton className="flex h-full w-full flex-col items-center justify-center rounded-xl">
          <Loader size={40} />
          Loading Data...
          <small className="text-[13px] text-gray-400">
            Gathering data, almost there!
          </small>
        </Skeleton>
      ) : isError || !data ? (
        <div className="f-col f-box h-full w-full items-center gap-2 rounded-xl border">
          <div className="f-center gap-1">
            <TriangleAlert className="size-4 text-gray-400" />
            <p className="text-[15px] text-gray-400">Chart failed to load.</p>
          </div>
          <Button size="icon-sm" onClick={() => refetch()}>
            <RotateCcw className="size-4" />
            Try again
          </Button>
        </div>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-full w-full"
        >
          <LineChart data={data} margin={{ right: -18 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              fontSize={12}
              tickLine={false}
              axisLine={{ strokeWidth: 0.5 }}
              interval={Math.floor(data.length / 10)}
              tickFormatter={(tick) => {
                const date = new Date(tick);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ strokeWidth: 0.5 }}
              fontSize={12}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
              cursor={false}
              defaultIndex={1}
            />
            <ChartLegend content={<ChartLegendContent />} />
            {symbols.map((symbol, i) => (
              <Line
                key={symbol}
                dataKey={symbol}
                stroke={COLORS[i % COLORS.length]}
                isAnimationActive={false}
                strokeWidth={2}
                dot={false}
                name={chartConfig[symbol].label ?? symbol}
              />
            ))}
          </LineChart>
        </ChartContainer>
      )}
    </div>
  );
};
