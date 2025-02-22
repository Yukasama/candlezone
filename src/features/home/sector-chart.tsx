'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { sectorColors } from '@/lib/fmp/data/filters';
import { SectorPerformance } from '@/lib/fmp/types/info';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';

const chartConfig = {
  performance: {
    label: 'Performance',
  },
  ...Object.fromEntries(
    Object.entries(sectorColors).map(([sector, color]) => [
      sector,
      {
        color,
        label: sector,
      },
    ]),
  ),
} satisfies ChartConfig;

interface Props {
  className?: string;
  data: SectorPerformance[];
}

export const SectorPerformanceChart = ({ className, data }: Props) => {
  const chartData = data.map((item) => ({
    color: sectorColors[item.sector],
    performance: Number(item.averageChange.toFixed(2)),
    sector: item.sector,
  }));

  const averagePerformance = (
    chartData.reduce((sum, item) => sum + item.performance, 0) /
    chartData.length
  ).toFixed(2);

  const isPositive = Number(averagePerformance) > 0;

  return (
    <Card className={cn('w-full max-w-[550px]', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-medium">
          Sector Performance
        </CardTitle>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-sm font-medium',
              isPositive ? 'text-success' : 'text-destructive',
            )}
          >
            {isPositive ? '+' : ''}
            {averagePerformance}%
          </span>
          {isPositive ? (
            <TrendingUp className="text-success h-4 w-4" />
          ) : (
            <TrendingDown className="text-destructive h-4 w-4" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="aspect-auto h-[220px] w-full sm:h-[300px]"
          config={chartConfig}
        >
          <BarChart accessibilityLayer data={chartData} layout="vertical">
            <XAxis
              domain={['auto', 'auto']}
              tickFormatter={(value) => `${String(value)}%`}
              type="number"
            />
            <YAxis
              axisLine={false}
              dataKey="sector"
              tick={{
                fontSize: 12,
                overflow: 'visible',
                width: 140,
              }}
              tickFormatter={(value) =>
                value === 'Communication Services'
                  ? 'Comm. Services'
                  : String(value)
              }
              tickLine={false}
              type="category"
              width={120}
            />
            <Bar dataKey="performance" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, i) => (
                <Cell fill={entry.color} key={`sector-${String(i)}`} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
