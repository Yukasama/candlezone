'use client'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { generateColors } from '@/utils/generators/generate-colors'
import { useEffect, useMemo, useState } from 'react'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface Props {
  sectors: (string | null | undefined)[]
}

export const PortfolioAllocation = ({ sectors }: Readonly<Props>) => {
  const [mounted, setMounted] = useState(false)

  const renderCustomLabel = ({ value }: { value: number }) => {
    return `${((value / sectors.length) * 100).toFixed(2)}%`
  }

  useEffect(() => setMounted(true), [])

  const sectorCount = useMemo(() => {
    const count: Record<string, number> = {}
    sectors.forEach((sector) => {
      if (sector) {
        if (count[sector]) {
          count[sector] += 1
        } else {
          count[sector] = 1
        }
      }
    })
    return count
  }, [sectors])

  const sortedData = useMemo(() => {
    const unsorted = Object.entries(sectorCount).map(([name, value]) => ({
      name,
      value,
    }))
    return unsorted.sort((a, b) => b.value - a.value)
  }, [sectorCount])

  const colors = useMemo(() => generateColors(sortedData.length), [sortedData])

  return (
    <Card className="h-[370px] w-full max-w-[500px] sm:h-[350px]">
      <CardHeader>
        <CardTitle>Portfolio Allocation</CardTitle>
        <CardDescription>Sector allocation of your portfolio</CardDescription>
      </CardHeader>

      {mounted && (
        <ResponsiveContainer width="100%" height={220}>
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
              {sortedData.map((entry, i) => (
                <Cell
                  key={entry.name}
                  fill={colors[i]}
                  stroke={colors[i]}
                  strokeWidth={0.6}
                />
              ))}
            </Pie>
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                border: 'none',
                borderRadius: '5px',
              }}
              wrapperStyle={{ zIndex: 100 }}
            />
            <Legend
              wrapperStyle={{ fontSize: '14px' }}
              verticalAlign="bottom"
              height={1}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
