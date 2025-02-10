'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { generateColors } from '@/lib/utils/generate-colors';
import { useMemo } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

interface Props {
  sectors: (null | string | undefined)[];
}

export const Allocation = ({ sectors }: Readonly<Props>) => {
  const renderCustomLabel = ({ value }: { value: number }) => {
    return `${((value / sectors.length) * 100).toFixed(2)}%`;
  };

  const sortedData = useMemo(() => {
    const count: Record<string, number> = {};

    for (const sector of sectors) {
      if (sector) {
        count[sector] = (count[sector] ?? 0) + 1;
      }
    }

    const sorted = Object.entries(count)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const colors = generateColors(sorted.length);

    return sorted.map((data, i) => ({
      ...data,
      color: colors.at(i),
    }));
  }, [sectors]);

  const chartConfig: ChartConfig = {};
  for (const { color, name } of sortedData) {
    chartConfig[name] = { color, label: name };
  }

  return (
    <Card className="bg-faded -space-y-3 border">
      <CardHeader>
        <CardTitle>Portfolio Allocation</CardTitle>
        <CardDescription>
          Filtered by sector: {sortedData.length} Sectors
        </CardDescription>
      </CardHeader>
      {/* <Select defaultValue="sector">
        <SelectTrigger className="w-[200px] pt-1">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sector">Sector</SelectItem>
          <SelectItem value="industry">Industry</SelectItem>
          <SelectItem value="country">Country</SelectItem>
        </SelectContent>
      </Select> */}
      <CardContent>
        <ChartContainer
          className="aspect-square h-[200px] w-full sm:w-[325px]"
          config={chartConfig}
        >
          <PieChart>
            <Pie
              data={sortedData}
              dataKey="value"
              endAngle={-180}
              fontSize={12}
              innerRadius={30}
              label={renderCustomLabel}
              outerRadius={55}
              paddingAngle={2}
              startAngle={180}
            >
              {sortedData.map(({ color, name }) => (
                <Cell
                  fill={color}
                  key={name}
                  stroke={color}
                  strokeWidth={0.6}
                />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            <ChartLegend
              className="flex-wrap justify-center gap-2 whitespace-nowrap"
              content={<ChartLegendContent nameKey="name" />}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
