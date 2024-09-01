'use client';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

interface Props {
  data: { name: string; div?: number }[];
}

const chartConfig = {
  div: { label: 'Dividend Yield' },
};

export const DividendChart = ({ data }: Readonly<Props>) => {
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
          dataKey="div"
          stroke="#a855f7"
          isAnimationActive={false}
          strokeWidth={1.75}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </LineChart>
    </ChartContainer>
  );
};
