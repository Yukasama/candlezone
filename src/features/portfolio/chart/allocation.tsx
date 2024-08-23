'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { generateColors } from '@/utils/generators/generate-colors'
import { useMemo } from 'react'
import { Cell, Pie, PieChart } from 'recharts'

interface Props {
  sectors: (string | null | undefined)[]
}

export const Allocation = ({ sectors }: Readonly<Props>) => {
  const renderCustomLabel = ({ value }: { value: number }) => {
    return `${((value / sectors.length) * 100).toFixed(2)}%`
  }

  const sortedData = useMemo(() => {
    const count: Record<string, number> = {}

    for (const sector of sectors) {
      if (sector) {
        count[sector] = (count[sector] ?? 0) + 1
      }
    }

    const sorted = Object.entries(count)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)

    const colors = generateColors(sorted.length)

    return sorted.map((data, i) => ({
      ...data,
      color: colors.at(i),
    }))
  }, [sectors])

  const chartConfig: ChartConfig = {}
  for (const data of sortedData) {
    chartConfig[data.name] = {
      label: data.name,
      color: data.color,
    }
  }

  return (
    <Card className="bg-faded -space-y-3 border">
      <CardHeader>
        <CardTitle>Portfolio Allocation</CardTitle>
        <CardDescription>
          Filtered by sector: {sectors.length} Sectors
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
          config={chartConfig}
          className="aspect-square h-[200px] w-full sm:w-[325px]"
        >
          <PieChart>
            <Pie
              data={sortedData}
              startAngle={180}
              endAngle={-180}
              innerRadius={30}
              outerRadius={55}
              paddingAngle={2}
              dataKey="value"
              fontSize={12}
              label={renderCustomLabel}
            >
              {sortedData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                  stroke={entry.color}
                  strokeWidth={0.6}
                />
              ))}
            </Pie>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="flex-wrap justify-center gap-2 whitespace-nowrap"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
