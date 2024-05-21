'use client'

import {
  XAxis,
  YAxis,
  Tooltip,
  Area,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  CartesianGrid,
  LabelList,
} from 'recharts'
import { HTMLAttributes, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import { useStockHistory } from '@/hooks/use-stock-history'

interface Props extends HTMLAttributes<HTMLDivElement> {
  symbol: string
}

const TIME_FRAMES = ['1D', '5D', '1M', '6M', '1Y', '5Y', 'All']

const CustomTooltip = ({
  active,
  payload,
  label,
  chartData,
}: {
  active: boolean
  payload: { value: number }[]
  label: string
  chartData: any
}) => {
  if (active && payload?.length && chartData) {
    return (
      <Card className="p-3 f-col gap-0.5">
        <p className="text-[15px]">{label}</p>
        <div className="flex items-center text-sm gap-1.5">
          <p className="text-zinc-400">Price:</p>
          <p
            className={`font-semibold ${
              chartData.positive ? 'text-[#19E363]' : 'text-[#e6221e]'
            }`}
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
  return null
}

const LastDot = ({ x, y, value, chartData }: any) => {
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

// eslint-disable-next-line sonarjs/cognitive-complexity
export const PriceChart = ({ symbol, className }: Readonly<Props>) => {
  const [mounted, setMounted] = useState(false)
  const [timeframe, setTimeframe] = useState<any>('1D')

  useEffect(() => setMounted(true), [])

  const { theme } = useTheme()
  const { chartData, refetch, isFetched } = useStockHistory({
    symbol,
    timeframe,
  })

  return (
    <div className={cn('w-full h-[290px] sm:h-[470px] f-col gap-4', className)}>
      <div className="flex sm:justify-end gap-3 p-1">
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

      {!isFetched ? (
        <div className="f-col gap-1 items-center mt-24">
          <Loader />
          Loading Data...
          <small className="text-zinc-400 text-[13px]">
            Gathering data, almost there!
          </small>
        </div>
      ) : mounted && chartData ? (
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
            {/* @ts-ignore */}
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
        <div className="f-box f-col gap-2">
          <p className="text-zinc-400">Chart failed to load.</p>
          <Button size="sm" onClick={() => refetch()}>
            <RotateCcw size={18} />
            Refetch
          </Button>
        </div>
      )}
    </div>
  )
}
