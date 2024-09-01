'use client';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

interface Props {
  data: { name: string; gm?: number; om?: number; pm?: number }[];
}

const chartConfig = {
  gm: { label: 'Gross Margin' },
  om: { label: 'Operating Margin' },
  pm: { label: 'Profit Margin' },
};

export const MarginChart = ({ data }: Readonly<Props>) => {
  return (
    <ChartContainer
      className="aspect-auto h-[220px] w-full sm:h-[300px]"
      config={chartConfig}
    >
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Bar dataKey="gm" fill="#22c55e" isAnimationActive={false} radius={4} />
        <Bar dataKey="om" fill="#3b82f6" isAnimationActive={false} radius={4} />
        <Bar dataKey="pm" fill="#a855f7" isAnimationActive={false} radius={4} />
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  );
};
