'use client';

import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePortfolioHistory } from '@/features/portfolio/chart/use-portfolio-history';
import { PortfolioWithQuotes } from '@/features/portfolio/types/portfolio';
import { LastDot } from '@/features/stock/components/last-dot';
import { cn } from '@/lib/utils';
import { Check, RotateCcw, Settings, TriangleAlert } from 'lucide-react';
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
import { ChartPerformance } from './chart-performance';

interface Props extends HTMLAttributes<HTMLDivElement> {
  portfolio: PortfolioWithQuotes;
}

const chartConfig = {
  totalValue: {
    label: 'Value',
  },
} satisfies ChartConfig;

export const PortfolioChart = ({ portfolio, className }: Readonly<Props>) => {
  const [excludeQuantity, setExcludeQuantity] = useState(false);
  const [showRealizedPL, setShowRealizedPL] = useState(true);

  const { theme } = useTheme();
  const { chartData, refetch, isFetched } = usePortfolioHistory({
    portfolio,
    options: { excludeQuantity, showRealizedPL },
  });

  const emptyPortfolio = portfolio.orders.length === 0;

  return (
    <div className={cn('f-col relative w-full gap-3 py-5 pl-5', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="absolute bottom-4 right-4">
          <Button size="icon" aria-label="Chart Settings">
            <Settings className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuItem
            onClick={() => setExcludeQuantity((prev) => !prev)}
            className="flex justify-between gap-2"
          >
            Exclude Quantity
            <Check
              className={cn(
                !emptyPortfolio && excludeQuantity ? 'flex' : 'hidden',
                'size-4',
              )}
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowRealizedPL((prev) => !prev)}
            className="flex justify-between gap-2"
          >
            Show realized P/L
            <Check
              className={cn(
                !emptyPortfolio && showRealizedPL ? 'flex' : 'hidden',
                'size-4',
              )}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="f-box h-[250px] w-full sm:h-[450px]">
        {isFetched ? (
          !chartData && !emptyPortfolio ? (
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
          ) : emptyPortfolio ? (
            <div className="f-center gap-1">
              <TriangleAlert className="size-4 text-gray-400" />
              <p className="text-[15px] text-gray-400">
                No positions added yet.
              </p>
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-full w-full"
            >
              <AreaChart accessibilityLayer data={chartData?.results}>
                <defs>
                  <linearGradient
                    id="colorValuePositive"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#1de095" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#1de095" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorValueNegative"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#e52b34" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#e52b34" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ strokeWidth: 0.5 }}
                  interval={Math.floor((chartData?.results.length ?? 0) / 10)}
                  tickFormatter={(tick, i) => (i === 0 ? '' : tick) as string}
                />
                <YAxis
                  domain={chartData?.domain}
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  interval="preserveStartEnd"
                  axisLine={{ strokeWidth: 0.5 }}
                  tickCount={8}
                  tickFormatter={(value, i) =>
                    i === 0 ? '' : Number.parseFloat(value as string).toFixed(1)
                  }
                />
                <ChartTooltip
                  content={<ChartTooltipContent indicator="line" />}
                  cursor={false}
                />
                {chartData && (
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
                )}
                <Area
                  dataKey="return"
                  type="monotone"
                  stroke={chartData?.positive ? '#1de095' : '#e52b34'}
                  fillOpacity={1}
                  yAxisId="right"
                  fill={`url(#${chartData?.positive ? 'colorValuePositive' : 'colorValueNegative'})`}
                  isAnimationActive={false}
                  strokeWidth={2}
                  dot={(props) => (
                    <LastDot {...props} key={props.key} chartData={chartData} />
                  )}
                />
              </AreaChart>
            </ChartContainer>
          )
        ) : (
          <div className="f-col items-center">
            <Loader size={40} />
            Loading Data...
            <small className="text-[13px] text-gray-400">
              Gathering data, almost there!
            </small>
          </div>
        )}
      </div>

      <div className="f-center justify-between">
        <ChartPerformance chartData={chartData} />
      </div>
    </div>
  );
};
