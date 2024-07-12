'use client'

import { getPortfolioHistory } from '@/actions/portfolio/get-portfolio-history'
import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { computeDomain, getFormattedDate } from '@/utils/chart-helper'
import { Portfolio } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { RotateCcw } from 'lucide-react'
import { useTheme } from 'next-themes'
import { HTMLAttributes, useEffect, useMemo, useState } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface Props extends HTMLAttributes<HTMLDivElement> {
  portfolio: Pick<Portfolio, 'id'>
}

const TIME_FRAMES = ['1D', '5D', '1M', '6M', '1Y', '5Y', 'All']

export const PortfolioChart = ({ portfolio, className }: Readonly<Props>) => {
  const [mounted, setMounted] = useState(false)
  const [timeframe, setTimeframe] = useState<(typeof TIME_FRAMES)[0]>('1D')

  useEffect(() => setMounted(true), [])

  const { theme } = useTheme()
  const { data, refetch, isFetched } = useQuery({
    queryFn: async () =>
      await getPortfolioHistory({
        portfolioId: portfolio.id,
        timeframe,
      }),
    queryKey: ['portfolio-history', portfolio.id, timeframe],
  })

  const chartData = useMemo(() => {
    if (isFetched && data) {
      const domain = computeDomain(data)
      const startPrice = Number(data[0].close)
      const endPrice = Number(data[data.length - 1].close)
      const positive = endPrice >= startPrice

      const formattedData = data.map((item: any) => ({
        date: getFormattedDate(item.date, timeframe),
        close: item.close,
      }))

      return {
        domain,
        startPrice,
        positive,
        results: formattedData,
      }
    }
    return null
  }, [isFetched, data, timeframe])

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active: boolean
    payload: { value: number }[]
    label: string
  }) => {
    if (active && payload?.length && data) {
      return (
        <Card className="f-col gap-0.5 p-3">
          <p className="text-[15px]">{label}</p>
          <div className="flex items-center gap-1.5 text-sm">
            <p className="text-gray-400">Price:</p>
            <p
              className={`font-semibold ${
                chartData?.positive ? 'text-[#19E363]' : 'text-[#e6221e]'
              }`}
            >
              ${payload[0].value.toFixed(2)} (
              <span>
                {(payload[0].value / Number(data[0].close)) * 100 - 100 > 0 &&
                  '+'}
                {(
                  (payload[0].value / Number(data[0].close)) * 100 -
                  100
                ).toFixed(2)}
                %)
              </span>
            </p>
          </div>
        </Card>
      )
    }
  }

  const renderLastDot = (props: any) => {
    const { x, y, value } = props
    if (value === chartData?.results[chartData.results.length - 1].close) {
      return (
        <circle
          cx={x}
          cy={y}
          r={4}
          fill={chartData?.positive ? '#1de095' : '#e52b34'}
        />
      )
    }
    return null
  }

  return (
    <div className={cn(className, 'f-col h-[290px] w-full gap-4 sm:h-[470px]')}>
      <div className="flex gap-3 p-1 sm:justify-end">
        <Tabs defaultValue={timeframe} aria-label="History Selector">
          <TabsList>
            {TIME_FRAMES.map((timeframe) => (
              <TabsTrigger
                onClick={() => setTimeframe(timeframe)}
                value={timeframe}
                key={timeframe}
                aria-label={timeframe}
              >
                {timeframe}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {!isFetched && (
        <div className="f-col mt-10 items-center gap-1 sm:mt-24">
          <Loader />
          Loading Data...
          <small className="text-[13px] text-gray-400">
            Gathering data, almost there!
          </small>
        </div>
      )}
      {isFetched && mounted && chartData && (
        <ResponsiveContainer width="100%">
          <ComposedChart data={chartData.results} margin={{ right: -18 }}>
            <defs>
              <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartData.positive ? '#1de095' : '#e52b34'}
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor={chartData.positive ? '#1de095' : '#e52b34'}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              horizontal
              stroke={theme === 'dark' ? '#18181b' : '#f4f4f5'}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              fontSize={12}
              tickLine={false}
              axisLine={{ strokeWidth: 0.5 }}
              interval={Math.floor(chartData.results.length / 10)}
              tickFormatter={(tickItem, i) => (i === 0 ? '' : tickItem)}
            />
            <YAxis
              domain={chartData.domain}
              yAxisId="right"
              orientation="right"
              tickLine={false}
              interval="preserveStartEnd"
              axisLine={{ strokeWidth: 0.5 }}
              tickCount={8}
              fontSize={12}
              tickFormatter={(value, i) =>
                i === 0 ? '' : `${value.toFixed(1)}`
              }
            />
            {/* @ts-expect-error recharts-type-error */}
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={chartData.startPrice}
              yAxisId="right"
              strokeDasharray="1 4"
              stroke={theme === 'dark' ? '#71717a' : '#3f3f46'}
              label={{
                position: 'top',
                value: `Price: ${chartData.startPrice}`,
                fill: '#666',
                fontSize: 12,
                fontWeight: 'bold',
              }}
            />
            <Area
              dataKey="close"
              type="monotone"
              stroke={chartData.positive ? '#1de095' : '#e52b34'}
              fillOpacity={1}
              yAxisId="right"
              fill="url(#colorClose)"
              isAnimationActive={false}
              strokeWidth={2}
            >
              <LabelList dataKey="close" content={renderLastDot} />
            </Area>
          </ComposedChart>
        </ResponsiveContainer>
      )}
      {isFetched && !chartData && (
        <div className="f-box f-col mt-20 gap-2">
          <p className="text-gray-400">Chart failed to load.</p>
          <Button size="sm" onClick={() => refetch()}>
            <RotateCcw size={18} />
            Refetch
          </Button>
        </div>
      )}
    </div>
  )
}
