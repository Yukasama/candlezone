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
import { getIndexes } from '@/features/home/actions/get-indexes';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { RotateCcw, TriangleAlert } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

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

  return (
    <div className="bg-faded h-[280px] rounded-lg border py-4 pt-6 sm:h-[350px]">
      {isLoading ? (
        <div className="f-box f-col rounded-xl">
          <Loader size={40} />
          Loading Data...
          <small className="text-[13px] text-gray-400">
            Gathering data, almost there!
          </small>
        </div>
      ) : isError || !data ? (
        <div className="f-col f-box h-4/5 gap-2 rounded-xl">
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
          <LineChart data={data} margin={{ right: 30 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              fontSize={12}
              tickLine={false}
              axisLine={{ strokeWidth: 0 }}
              interval={Math.floor(data.length / 10)}
            />
            <YAxis
              tickLine={false}
              axisLine={{ strokeWidth: 0.5 }}
              fontSize={12}
              tickFormatter={(value: number) =>
                typeof value === 'number' ? `${value.toFixed(1)}%` : '0%'
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, { color }) => (
                    <div className="f-center min-w-[130px] gap-2 text-xs text-muted-foreground">
                      <div
                        className="h-4 w-1 rounded-md"
                        style={{ backgroundColor: color }}
                      />
                      <div className="w-24">{name}</div>
                      <div
                        className={cn(
                          'ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground',
                          Number(value) >= 0
                            ? 'text-price-up'
                            : 'text-price-down',
                        )}
                      >
                        {Number(value) >= 0 ? '+' : ''}
                        {Number(value).toFixed(2)}
                        <span className="font-normal text-muted-foreground">
                          %
                        </span>
                      </div>
                    </div>
                  )}
                />
              }
              cursor={false}
              defaultIndex={1}
            />
            <ChartLegend content={<ChartLegendContent />} />
            {symbols.map((symbol, i) => (
              <Line
                key={symbol}
                type="monotone"
                dataKey={symbol}
                stroke={COLORS[i % COLORS.length]}
                isAnimationActive={false}
                strokeWidth={2}
                dot={false}
                name={
                  chartConfig[symbol as keyof typeof chartConfig].label ??
                  symbol
                }
              />
            ))}
          </LineChart>
        </ChartContainer>
      )}
    </div>
  );
};
