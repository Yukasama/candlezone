"use client"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { HTMLAttributes } from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

interface Props extends HTMLAttributes<HTMLDivElement> {
  data: { name: string; pe?: number; pb?: number; ps?: number }[];
}

const chartConfig = {
  pe: { label: 'Price to Earnings' },
  pb: { label: 'Price to Book' },
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
        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Line
          type="natural"
          dataKey="pe"
          stroke="#22c55e"
          isAnimationActive={false}
          strokeWidth={1.75}
        />
        <Line
          type="natural"
          dataKey="pb"
          stroke="#3b82f6"
          isAnimationActive={false}
          strokeWidth={1.75}
        />
        <Line
          type="natural"
          dataKey="ps"
          stroke="#8b5cf6"
          isAnimationActive={false}
          strokeWidth={1.75}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </LineChart>
    </ChartContainer>
  );
};
