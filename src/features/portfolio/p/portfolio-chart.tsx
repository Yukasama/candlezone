'use client'

import { getPortfolioHistory } from '@/actions/portfolio/get-portfolio-history'
import { StockImage } from '@/components/stock/stock-image'
import { Button } from '@/components/ui/button'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { PortfolioWithQuotes } from '@/types/portfolio'
import { computeDomain } from '@/utils/chart-helper'
import { useQuery } from '@tanstack/react-query'
import { RotateCcw } from 'lucide-react'
import { useTheme } from 'next-themes'
import { HTMLAttributes, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts'
import { PChartPerformance } from './p-chart-header'

interface Props extends HTMLAttributes<HTMLDivElement> {
  portfolio: Pick<PortfolioWithQuotes, 'id' | 'stocks'>
}

const renderStockLabel = ({ x, y, logo, symbol }: any) => {
  return (
    <g>
      <StockImage src={logo} px={20} />
      <text x={x} y={y} fill="#666" textAnchor="middle" fontSize="12">
        {symbol}
      </text>
    </g>
  )
}

const chartConfig = {
  change: {
    label: 'Change',
  },
} satisfies ChartConfig

export const PortfolioChart = ({ portfolio, className }: Readonly<Props>) => {
  const [excludeQuantity, setExcludeQuantity] = useState(false)

  const { theme } = useTheme()
  const { data, refetch, isFetched } = useQuery({
    queryFn: async () => {
      return await getPortfolioHistory({
        portfolioId: portfolio.id,
        options: { excludeQuantity },
      })
    },
    queryKey: ['portfolio-history', portfolio.id, excludeQuantity],
  })

  const chartData = useMemo(() => {
    if (isFetched && data) {
      const domain = computeDomain(data)
      const startPrice = Number(data[0].change)
      const endPrice = Number(data[data.length - 1].change)
      const positive = endPrice >= startPrice
      const allTime = endPrice - data[data.length - 2].change

      return {
        domain,
        startPrice,
        endPrice,
        allTime,
        positive,
        results: data,
      }
    }
  }, [isFetched, data])

  const renderLastDot = ({ x, y, value }: any) => {
    if (value === chartData?.results[chartData.results.length - 1].change) {
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

  const stockLabels = portfolio.stocks.map((stock) => ({
    date: stock.createdAt?.toISOString().split('T')[0],
    logo: stock.image,
    symbol: stock.symbol,
  }))

  return (
    <div className={cn('relative w-full pl-3 pt-3', className)}>
      {/* {!isFetched && (
        <div className="f-col items-center gap-1">
          <Loader />
          Loading Data...
          <small className="text-[13px] text-gray-400">
            Gathering data, almost there!
          </small>
        </div>
      )} */}
      <div className="f-center justify-between pb-3 pr-3">
        <div className="f-center gap-2">
          <Checkbox
            onCheckedChange={() => setExcludeQuantity((prev) => !prev)}
          />
          Exclude Quantity
        </div>
        <PChartPerformance chartData={chartData} />
      </div>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full sm:h-[500px]"
      >
        <AreaChart accessibilityLayer data={chartData?.results}>
          <defs>
            <linearGradient id="colorChange" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={chartData?.positive ? '#1de095' : '#e52b34'}
                stopOpacity={0.35}
              />
              <stop
                offset="95%"
                stopColor={chartData?.positive ? '#1de095' : '#e52b34'}
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
            tickLine={false}
            axisLine={{ strokeWidth: 0.5 }}
            interval={Math.floor((chartData?.results.length ?? 0) / 10)}
            tickFormatter={(tickItem, i) => (i === 0 ? '' : tickItem)}
          />
          <YAxis
            domain={chartData?.domain}
            yAxisId="right"
            orientation="right"
            tickLine={false}
            interval="preserveStartEnd"
            axisLine={{ strokeWidth: 0.5 }}
            tickCount={8}
            tickFormatter={(value, i) => (i === 0 ? '' : `${value.toFixed(1)}`)}
          />
          <ChartTooltip
            content={<ChartTooltipContent indicator="line" />}
            cursor={false}
            defaultIndex={1}
          />
          {chartData && (
            <ReferenceLine
              y={chartData.startPrice}
              yAxisId="right"
              strokeDasharray="1 4"
              stroke={theme === 'dark' ? '#71717a' : '#3f3f46'}
              label={{
                position: 'top',
                value: `Change: ${chartData.startPrice.toFixed(2)}%`,
                fill: '#666',
                fontSize: 12,
                fontWeight: 'bold',
              }}
            />
          )}
          {stockLabels.length > 0 &&
            stockLabels.map((stock, i) => (
              <ReferenceLine
                key={i}
                x={stock.date}
                stroke={theme === 'dark' ? '#71717a' : '#3f3f46'}
                strokeDasharray="1 3"
                label={({ x, y }) =>
                  renderStockLabel({
                    x,
                    y,
                    logo: stock.logo,
                    symbol: stock.symbol,
                  })
                }
                yAxisId="right"
              />
            ))}
          <Area
            dataKey="change"
            type="monotone"
            stroke={chartData?.positive ? '#1de095' : '#e52b34'}
            fillOpacity={1}
            yAxisId="right"
            fill="url(#colorChange)"
            isAnimationActive={false}
            strokeWidth={2}
          >
            <LabelList dataKey="change" content={renderLastDot} />
          </Area>
        </AreaChart>
      </ChartContainer>
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
