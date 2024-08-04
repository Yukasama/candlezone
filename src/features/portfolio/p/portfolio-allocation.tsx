'use client'

import { Card } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { generateColors } from '@/utils/generators/generate-colors'
import { useMemo } from 'react'
import { Cell, Legend, Pie, PieChart } from 'recharts'

interface Props {
  sectors: (string | null | undefined)[]
}

const chartConfig = {
  value: {},
} satisfies ChartConfig

export const PortfolioAllocation = ({ sectors }: Readonly<Props>) => {
  const renderCustomLabel = ({ value }: { value: number }) => {
    return `${((value / sectors.length) * 100).toFixed(2)}%`
  }

  const sortedData = useMemo(() => {
    const count: Record<string, number> = {}

    for (const sector of sectors) {
      if (sector) {
        count[sector] = (count[sector] || 0) + 1
      }
    }

    const unsorted = Object.entries(count).map(([name, value]) => ({
      name,
      value,
    }))

    const sorted = unsorted.sort((a, b) => b.value - a.value)
    const colors = generateColors(sorted.length)

    return sorted.map((data, index) => ({
      ...data,
      color: colors[index],
    }))
  }, [sectors])

  return (
    <Card className="h-[370px] w-full max-w-[500px] sm:h-[350px]">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full sm:h-[500px]"
      >
        <PieChart margin={{ top: -10, bottom: 30 }}>
          <Pie
            data={sortedData}
            startAngle={180}
            endAngle={-180}
            innerRadius={45}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
            fontSize={14}
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
          <Legend
            wrapperStyle={{ fontSize: '14px' }}
            verticalAlign="bottom"
            height={1}
          />
        </PieChart>
      </ChartContainer>
    </Card>
  )
}
