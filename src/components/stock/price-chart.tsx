'use client'

import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Timeframe } from '@/config/fmp'
import { useStockHistory } from '@/hooks/use-stock-history'
import { cn } from '@/lib/utils'
import { ChartData } from '@/types/stock'
import { RotateCcw } from 'lucide-react'
import { useTheme } from 'next-themes'
import { HTMLAttributes, useEffect, useState } from 'react'
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
  symbol: string
}

const TIME_FRAMES: Timeframe[] = ['1D', '5D', '1M', '6M', '1Y', '5Y', 'All']

const CustomTooltip = ({
  active,
  payload,
  label,
  chartData,
}: {
  active: boolean
  payload: { value: number }[]
  label: string
  chartData: ChartData
}) => {
  if (active && payload?.length && chartData) {
    return (
      <Card className="f-col gap-0.5 p-3">
        <p className="text-[15px]">{label}</p>
        <div className="f-center gap-1.5 text-sm">
          <p className="text-gray-400">Price:</p>
          <p
            className={cn(
              'font-semibold',
              chartData.positive ? 'text-price-up' : 'text-price-down',
            )}
          >
            ${payload[0].value.toFixed(2)} (
            <span>
              {(payload[0].value / Number(chartData.startPrice)) * 100 - 100 >
                0 && '+'}
              {(
                (payload[0].value / Number(chartData.startPrice)) * 100 -
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

interface LastDotProps {
  x?: string | number
  y?: string | number
  value?: string | number
  chartData?: ChartData
}

const LastDot = ({ x, y, value, chartData }: LastDotProps) => {
  if (value === chartData?.results.at(-1)?.close) {
    return (
      <circle
        cx={x}
        cy={y}
        r={4}
        fill={chartData?.positive ? '#1de095' : '#e52b34'}
      />
    )
  }
}

export const PriceChart = ({ symbol, className }: Readonly<Props>) => {
  const [mounted, setMounted] = useState(false)
  const [timeframe, setTimeframe] = useState<Timeframe>('1D')

  useEffect(() => setMounted(true), [])

  const { theme } = useTheme()
  const { chartData, refetch, isFetched } = useStockHistory({
    symbol,
    timeframe,
  })

  return (
    <div className={cn('f-col h-[290px] w-full gap-4 sm:h-[470px]', className)}>
      <div className="flex gap-3 p-1 sm:justify-end">
        <Tabs defaultValue={timeframe}>
          <TabsList>
            {TIME_FRAMES.map((timeframe) => (
              <TabsTrigger
                value={timeframe}
                key={timeframe}
                onClick={() => setTimeframe(timeframe)}
                aria-label={`${timeframe} view`}
              >
                {timeframe}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {isFetched ? (
        mounted && chartData ? (
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
                tickFormatter={(tickItem, i) =>
                  (i === 0 ? '' : tickItem) as string
                }
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
                  i === 0
                    ? ''
                    : `${Number.parseFloat(value as string).toFixed(1)}`
                }
              />
              {/* @ts-expect-error recharts-type-error */}
              <Tooltip content={<CustomTooltip chartData={chartData} />} />
              <ReferenceLine
                y={chartData.startPrice}
                yAxisId="right"
                strokeDasharray="1 4"
                stroke={theme === 'dark' ? '#71717a' : '#3f3f46'}
                label={{
                  position: 'top',
                  value: `Price: ${chartData.startPrice.toFixed(2)}`,
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
                <LabelList
                  dataKey="close"
                  content={<LastDot chartData={chartData} />}
                />
              </Area>
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="f-box f-col mt-20 gap-2">
            <p className="text-gray-400">Chart failed to load.</p>
            <Button size="sm" onClick={() => refetch()}>
              <RotateCcw size={18} />
              Refetch
            </Button>
          </div>
        )
      ) : (
        <div className="f-col mt-10 items-center gap-1 sm:mt-24">
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
