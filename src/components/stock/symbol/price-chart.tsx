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
import { HTMLAttributes, memo, useEffect, useMemo, useState } from 'react'
import { cn, computeDomain, getFormattedDate } from '@/utils/utils'
import { Tabs, Tab } from '@nextui-org/tabs'
import { Card } from '@/components/ui/card'
import { Spinner } from '@nextui-org/spinner'
import { useTheme } from 'next-themes'
import { useQuery } from '@tanstack/react-query'
import { getHistory } from '@/actions/stock/get-history'

interface Props extends HTMLAttributes<HTMLDivElement> {
  symbol: string
}

const PriceChart = memo(({ symbol, className }: Readonly<Props>) => {
  const [mounted, setMounted] = useState(false)
  const [timeframe, setTimeframe] = useState<any>('1D')

  const TIME_FRAMES = ['1D', '5D', '1M', '6M', '1Y', '5Y', 'All']

  const { theme } = useTheme()
  const { data, isFetched } = useQuery({
    queryFn: async () =>
      await getHistory({
        symbol,
        timeframe,
      }),
    queryKey: ['stock-history', timeframe, symbol],
  })

  useEffect(() => setMounted(true), [])

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
        <Card className="p-3 f-col gap-0.5">
          <p className="text-[15px]">{label}</p>
          <div className="flex items-center text-sm gap-1.5">
            <p className="text-zinc-400">Price:</p>
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
    return null
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
    <div className={cn('w-full h-[290px] sm:h-[470px] f-col gap-4', className)}>
      <div className="flex sm:justify-end gap-3 p-1">
        <Tabs
          selectedKey={timeframe}
          isDisabled={!mounted}
          variant="bordered"
          size="sm"
          aria-label="History Selector"
          classNames={{ tabList: 'border-1' }}
          onSelectionChange={setTimeframe}
        >
          {TIME_FRAMES.map((timeframe) => (
            <Tab key={timeframe} aria-label={timeframe} title={timeframe} />
          ))}
        </Tabs>
      </div>

      {!isFetched && (
        <div className="f-col gap-1 items-center mt-24">
          <Spinner />
          Loading Data...
          <small className="text-zinc-400 text-[13px]">
            Gathering data, almost there!
          </small>
        </div>
      )}
      {isFetched && mounted && chartData ? (
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
            <Tooltip content={<CustomTooltip />} />
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
              <LabelList dataKey="close" content={renderLastDot} />
            </Area>
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-zinc-400">Chart failed to load.</p>
      )}
    </div>
  )
})

PriceChart.displayName = 'PriceChart'

export default PriceChart
