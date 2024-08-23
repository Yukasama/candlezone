'use client'

import { Loader } from '@/components/loader'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { HTMLAttributes, useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

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
      <Card className="f-col gap-0.5 p-3">
        <p className="text-[15px]">{label}</p>
        <div className="f-center gap-1.5 text-sm">
          <p className="text-gray-400">Gross Margin:</p>
          <p className="font-semibold text-green-500">
            {(payload[0].value * 100).toFixed(2)}%
          </p>
        </div>
        <div className="f-center gap-1.5 text-sm">
          <p className="text-gray-400">Operating Margin:</p>
          <p className="font-semibold text-blue-500">
            {(payload[1].value * 100).toFixed(2)}%
          </p>
        </div>
        <div className="f-center gap-1.5 text-sm">
          <p className="text-gray-400">Profit Margin:</p>
          <p className="font-semibold text-purple-500">
            {(payload[2].value * 100).toFixed(2)}%
          </p>
        </div>
      </Card>
    )
  }
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  data: { name: string; gm?: number; om?: number; pm?: number }[]
}

export default function MarginChart({ data, className }: Readonly<Props>) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => setMounted(true), [])

  return (
    <div className={cn('h-[220px] w-full sm:h-[300px]', className)}>
      {mounted ? (
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
                i === 0 ? '' : `${(value * 100).toFixed(0)}%`
              }
            />
            {/* @ts-expect-error recharts-type-error */}
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
      ) : (
        <div className="f-col mt-16 items-center gap-1">
          <Loader />
          Loading Data...
          <small className="text-[13px] text-gray-400">
            Gathering data, almost there!
          </small>
        </div>
      )}
    </div>
  )
}
