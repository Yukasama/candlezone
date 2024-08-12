'use client'

import { getPortfolioHistory } from '@/actions/portfolio/get-portfolio-history'
import { StockImage } from '@/components/stock/stock-image'
import { Button } from '@/components/ui/button'
import { CardDescription, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { PortfolioWithQuotes } from '@/types/portfolio'
import { computeDomain } from '@/utils/chart-helper'
import { useQuery } from '@tanstack/react-query'
import { RotateCcw, Settings } from 'lucide-react'
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
import { PortfolioAddModal } from '../add-modal'
import { ChartPerformance } from './chart-performance'

interface Props extends HTMLAttributes<HTMLDivElement> {
  portfolio: PortfolioWithQuotes
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

const renderLastDot = ({ x = 0, y = 0, value, chartData }: any) => {
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

  const emptyPortfolio = portfolio.stocks.length === 0
  const chartData = useMemo(() => {
    if (isFetched && data?.length) {
      const domain = computeDomain(data)
      const startPrice = Number(data[0].change)
      const endPrice = Number(data[data.length - 1].change)
      const positive = endPrice >= startPrice
      const today = endPrice - (data[data.length - 2]?.change ?? 0)

      return {
        domain,
        startPrice,
        endPrice,
        today,
        positive,
        results: data,
      }
    }
  }, [isFetched, data])

  const stockLabels = portfolio.stocks.map((stock) => ({
    date: stock.createdAt?.toISOString().split('T')[0],
    logo: stock.image,
    symbol: stock.symbol,
  }))

  return (
    <div className={cn('f-col relative w-full gap-3 py-5 pl-5', className)}>
      {/* {!isFetched && (
        <div className="f-col items-center gap-1">
          <Loader />
          Loading Data...
          <small className="text-[13px] text-gray-400">
            Gathering data, almost there!
          </small>
        </div>
      )} */}
      {emptyPortfolio && (
        <div className="bg-faded flex justify-between rounded-md border border-violet-500/80 p-3 px-5">
          <div>
            <CardTitle>No stocks in this portfolio.</CardTitle>
            <CardDescription>
              Get started by adding some stocks.
            </CardDescription>
          </div>
          <PortfolioAddModal portfolio={portfolio} />
        </div>
      )}

      <Popover>
        <PopoverTrigger asChild className="absolute bottom-4 right-4">
          <Button size="icon">
            <Settings size={18} className="cursor-pointer" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="f-center gap-2 text-sm">
          <Checkbox
            disabled={emptyPortfolio}
            onCheckedChange={() => setExcludeQuantity((prev) => !prev)}
          />
          Exclude Quantity
        </PopoverContent>
      </Popover>

      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full sm:h-[450px]"
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
                    ...stock,
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
            <LabelList
              dataKey="change"
              content={({ x, y = 0, value }) =>
                renderLastDot({ x, y, value, chartData })
              }
            />
          </Area>
        </AreaChart>
      </ChartContainer>

      <div className="f-center justify-between">
        <ChartPerformance chartData={chartData} />
      </div>

      {isFetched && !chartData && !emptyPortfolio && (
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
