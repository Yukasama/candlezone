'use client';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { HTMLAttributes } from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

interface Props extends HTMLAttributes<HTMLDivElement> {
  data: { name: string; pb?: number; pe?: number; ps?: number }[];
}

const chartConfig = {
  pb: { label: 'Price to Book' },
  pe: { label: 'Price to Earnings' },
  ps: { label: 'Price to Sales' },
};

export const MetricsChart = ({ data }: Readonly<Props>) => {
  return (
    <ChartContainer
      className="aspect-auto h-[220px] w-full sm:h-[300px]"
      config={chartConfig}
    >
      <LineChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis axisLine={false} dataKey="name" fontSize={12} tickLine={false} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Line
          dataKey="pe"
          isAnimationActive={false}
          stroke="#22c55e"
          strokeWidth={1.75}
          type="natural"
        />
        <Line
          dataKey="pb"
          isAnimationActive={false}
          stroke="#3b82f6"
          strokeWidth={1.75}
          type="natural"
        />
        <Line
          dataKey="ps"
          isAnimationActive={false}
          stroke="#8b5cf6"
          strokeWidth={1.75}
          type="natural"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </LineChart>
    </ChartContainer>
  );
};
