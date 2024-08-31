'use client';

import { LastDot } from '@/components/stock/last-dot';
import { StockImage } from '@/components/stock/stock-image';
import { Button } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { usePortfolioHistory } from '@/features/portfolio/chart/use-portfolio-history';
import { cn } from '@/lib/utils';
import { PortfolioWithQuotes } from '@/types/portfolio';
import { Stock } from '@prisma/client';
import { RotateCcw, Settings } from 'lucide-react';
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

interface StockLabel {
  x?: string | number;
  y?: string | number;
  stock: Pick<Stock, 'symbol'> & { image?: string };
}

const renderStockLabel = ({ x, y, stock: { symbol, image } }: StockLabel) => {
  return (
    <g>
      <StockImage src={image} px={20} />
      <text x={x} y={y} fill="#666" textAnchor="middle" fontSize="12">
        {symbol}
      </text>
    </g>
  );
};

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
  const stockLabels = portfolio.orders.map((order) => ({
    date: order.createdAt?.toISOString().split('T')[0],
    ...order.stock,
  }));

  return (
    <div className={cn('f-col relative w-full gap-3 py-5 pl-5', className)}>
      {/* {!isFetched && (
        <div className="f-col items-center gap-1">
          <Loader />
          Loading Data...
          <small className="text-[13px] text-gray-400">
            Gathering data, almost there!
          </small>
        </div>
      )} */}
      <Popover>
        <PopoverTrigger asChild className="absolute bottom-4 right-4">
          <Button size="icon">
            <Settings size={18} className="cursor-pointer" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="f-center gap-2 text-sm">
          <Checkbox
            disabled={emptyPortfolio}
            onCheckedChange={() => setExcludeQuantity((prev) => !prev)}
          />
          Exclude Quantity
          <Checkbox
            disabled={emptyPortfolio}
            onCheckedChange={() => setShowRealizedPL((prev) => !prev)}
          />
          Show Realized P/L
        </PopoverContent>
      </Popover>

      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full sm:h-[450px]"
      >
        <AreaChart accessibilityLayer data={chartData?.results}>
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
          <CartesianGrid
            horizontal
            stroke={theme === 'dark' ? '#18181b' : '#f4f4f5'}
            vertical={false}
          />
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
                value: `Return: ${chartData.startPrice.toFixed(2)}$`,
                fill: '#666',
                fontSize: 12,
                fontWeight: 'bold',
              }}
            />
          )}
          {stockLabels.length > 0 &&
            stockLabels.map((stock) => (
              <ReferenceLine
                key={stock.id}
                x={stock.date}
                stroke={theme === 'dark' ? '#71717a' : '#3f3f46'}
                strokeDasharray="1 3"
                label={({ x, y }: { x: string | number; y: string | number }) =>
                  renderStockLabel({ x, y, stock })
                }
                yAxisId="right"
              />
            ))}
          <Area
            dataKey="return"
            type="monotone"
            stroke={chartData?.positive ? '#1de095' : '#e52b34'}
            fillOpacity={1}
            yAxisId="right"
            fill={`url(#${chartData?.positive ? 'colorValuePositive' : 'colorValueNegative'})`}
            isAnimationActive={false}
            strokeWidth={2}
            dot={(props) => <LastDot {...props} chartData={chartData} />}
          />
        </AreaChart>
      </ChartContainer>

      <div className="f-center justify-between">
        <ChartPerformance chartData={chartData} />
      </div>

      {isFetched && !chartData && !emptyPortfolio && (
        <div className="f-box f-col mt-20 gap-2">
          <p className="text-gray-400">Chart failed to load.</p>
          <Button size="sm" onClick={() => refetch()}>
            <RotateCcw size={18} />
            Refetch
          </Button>
        </div>
      )}
    </div>
  );
};
