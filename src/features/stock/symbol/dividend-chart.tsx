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
  data: { div?: number; name: string }[];
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
        <XAxis axisLine={false} dataKey="name" fontSize={12} tickLine={false} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Line
          dataKey="div"
          isAnimationActive={false}
          stroke="#a855f7"
          strokeWidth={1.75}
          type="natural"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </LineChart>
    </ChartContainer>
  );
};
