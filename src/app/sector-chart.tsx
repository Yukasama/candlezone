'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { sectorColors } from '@/lib/fmp/data/filters';
import { SectorPerformance } from '@/lib/fmp/types/info';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';

export const chartConfig = {
  averageChange: {
    label: 'Performance',
  },
  'Basic Materials': {
    label: 'Basic Materials',
    color: sectorColors['Basic Materials'],
  },
  'Communication Services': {
    label: 'Communication Services',
    color: sectorColors['Communication Services'],
  },
  'Consumer Cyclical': {
    label: 'Consumer Cyclical',
    color: sectorColors['Consumer Cyclical'],
  },
  'Consumer Defensive': {
    label: 'Consumer Defensive',
    color: sectorColors['Consumer Defensive'],
  },
  Energy: {
    label: 'Energy',
    color: sectorColors['Energy'],
  },
  'Financial Services': {
    color: sectorColors['Financial Services'],
    label: 'Financial Services',
  },
  Healthcare: {
    label: 'Healthcare',
    color: sectorColors['Healthcare'],
  },
  Industrials: {
    label: 'Industrials',
    color: sectorColors['Industrials'],
  },
  'Real Estate': {
    label: 'Real Estate',
    color: sectorColors['Real Estate'],
  },
  Technology: {
    label: 'Technology',
    color: sectorColors['Technology'],
  },
  Utilities: {
    label: 'Utilities',
    color: sectorColors['Utilities'],
  },
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
    <Card className={cn('w-full', className)}>
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
      <CardContent className="pb-4">
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
              scale="band"
              tick={{ fontSize: 12 }}
              tickLine={false}
              type="category"
            />
            <Bar dataKey="performance" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell fill={entry.color} key={index} />
              ))}
            </Bar>
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
        <div className="text-muted-foreground mt-2 text-xs">
          {format(new Date(data[0].date), 'MMMM d, yyyy')}
        </div>
      </CardContent>
    </Card>
  );
};
