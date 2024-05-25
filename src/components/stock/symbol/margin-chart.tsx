'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { HTMLAttributes, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { Card } from '@/components/ui/card'
import { Loader } from '@/components/loader'

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active: boolean
  payload: { value: number }[]
  label: string
}) => {
  if (active && payload?.length) {
    return (
      <Card className="p-3 f-col gap-0.5">
        <p className="text-[15px]">{label}</p>
        <div className="flex items-center text-sm gap-1.5">
          <p className="text-gray-400">Gross Margin:</p>
          <p className="font-semibold text-green-500">
            {(payload[0].value * 100).toFixed(2)}%
          </p>
        </div>
        <div className="flex items-center text-sm gap-1.5">
          <p className="text-gray-400">Operating Margin:</p>
          <p className="font-semibold text-blue-500">
            {(payload[1].value * 100).toFixed(2)}%
          </p>
        </div>
        <div className="flex items-center text-sm gap-1.5">
          <p className="text-gray-400">Profit Margin:</p>
          <p className="font-semibold text-purple-500">
            {(payload[2].value * 100).toFixed(2)}%
          </p>
        </div>
      </Card>
    )
  }
  return null
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  data: any
}

export default function MarginChart({ data, className }: Readonly<Props>) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => setMounted(true), [])

  return (
    <div className={cn('w-full h-[220px] sm:h-[300px]', className)}>
      {!mounted ? (
        <div className="f-col gap-1 items-center mt-16">
          <Loader />
          Loading Data...
          <small className="text-gray-400 text-[13px]">
            Gathering data, almost there!
          </small>
        </div>
      ) : (
        <ResponsiveContainer width="100%">
          <BarChart data={data} margin={{ left: -22, right: 15 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === 'dark' ? '#18181b' : '#f4f4f5'}
            />
            <XAxis
              dataKey="name"
              fontSize={12}
              tickLine={false}
              axisLine={{ strokeWidth: 0.5 }}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={{ strokeWidth: 0.5 }}
              tickFormatter={(value, i) =>
                i === 0 ? '' : `${(value * 100).toFixed()}%`
              }
            />
            {/* @ts-ignore */}
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="gm"
              fill="#22c55e"
              name="Gross M."
              isAnimationActive={false}
            />
            <Bar
              dataKey="om"
              fill="#3b82f6"
              name="Operating M."
              isAnimationActive={false}
            />
            <Bar
              dataKey="pm"
              fill="#a855f7"
              name="Profit M."
              isAnimationActive={false}
            />
            <Legend
              height={32}
              verticalAlign="top"
              wrapperStyle={{ fontSize: '14px' }}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
