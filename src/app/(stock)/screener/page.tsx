'use client'

import { useState } from 'react'
import {
  sectors,
  industries,
  countries,
  peRatios,
  pegRatios,
  marketCaps,
  earningsDates,
  exchanges,
} from '@/utils/screener/filters'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BarChart2, FileText, Layers, RotateCcw } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ScreenerProps } from '@/lib/validators/stock'
import { PageLayout } from '@/components/shared/page-layout'
import { useQuery } from '@tanstack/react-query'
import { queryStocks } from '@/actions/stock/query-stocks'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AddStockPortfolio } from '@/components/stock/add-stock-portfolio'
import { SCREENER_TABLE_COLUMNS } from '@/config/screener-table-columns'
import Link from 'next/link'
import { SymbolItem } from '@/components/stock/symbol-item'
import { formatMarketCap } from '@/utils/stock-helper'
import { Badge } from '@/components/ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationNext,
  PaginationItem,
} from '@/components/ui/pagination'
import { Loader } from '@/components/loader'

const DEFAULT_STATE = {
  exchange: 'Any',
  ticker: '',
  sector: 'Any',
  industry: 'Any',
  country: 'Any',
  earningsDate: 'Any',
  peRatio: ['Any', 'Any'] as [string, string],
  pegRatio: ['Any', 'Any'] as [string, string],
  mktCap: 'Any',
  sma50: ['Any', 'Any'] as [string, string],
}

export default function ScreenerPage() {
  const [resetCounter, setResetCounter] = useState(0)
  const [input, setInput] = useState<ScreenerProps>(DEFAULT_STATE)

  const router = useRouter()
  const searchParams = useSearchParams()

  // Cursor defines the current page of the pagination
  const cursor =
    typeof searchParams.get('cursor') === 'string'
      ? Number(searchParams.get('cursor'))
      : 1

  // Take defines how much stocks are being shown per pagination
  const takeParam =
    typeof searchParams.get('take') === 'string' &&
    Number(searchParams.get('take'))
  const take = takeParam && takeParam >= 1 && takeParam <= 50 ? takeParam : 10

  const { data, isFetched } = useQuery({
    queryFn: async () => await queryStocks({ ...input, cursor, take }),
    queryKey: ['screener', input, cursor, take],
  })

  // Set all filters on "Any" on reset button click
  const resetFilters = () => {
    setInput(DEFAULT_STATE)
    setResetCounter((prev) => prev + 1)
    router.replace(`/screener?cursor=1&take=${take}`)
  }

  const updateFilter = (
    filterId: keyof typeof DEFAULT_STATE,
    newValue: string,
    i?: number
  ) => {
    setInput((prev) => {
      if (i !== undefined && Array.isArray(prev[filterId])) {
        const updatedTuple = prev[filterId] as [string, string]
        updatedTuple[i] = newValue
        return {
          ...prev,
          [filterId]: updatedTuple,
        }
      }
      return {
        ...prev,
        [filterId]: newValue,
      }
    })
  }

  const DESCRIPTIVE_FILTERS = [
    {
      id: 'exchange',
      label: 'Exchange',
      value: input.exchange,
      value2: null,
      options: exchanges,
      setOption: (value: string) => updateFilter('exchange', value),
    },
    {
      id: 'sector',
      label: 'Sector',
      value: input.sector,
      value2: null,
      options: sectors,
      setOption: (value: string) => updateFilter('sector', value),
    },
    {
      id: 'industry',
      label: 'Industry',
      value: input.industry,
      value2: null,
      options: industries,
      setOption: (value: string) => updateFilter('industry', value),
    },
    {
      id: 'country',
      label: 'Country',
      value: input.country,
      value2: null,
      options: countries,
      setOption: (value: string) => updateFilter('country', value),
    },
    {
      id: 'earningsDate',
      label: 'Earnings Date',
      value: input.earningsDate,
      value2: null,
      options: earningsDates,
      setOption: (value: string) => updateFilter('earningsDate', value),
    },
    {
      id: 'mktCap',
      label: 'Market Cap',
      value: input.mktCap,
      value2: null,
      options: marketCaps,
      setOption: (value: string) => updateFilter('mktCap', value),
    },
  ]

  const FUNDAMENTAL_FILTERS = [
    {
      id: 'peRatio',
      label: 'P/E Ratio',
      value: input.peRatio[0],
      value2: input.peRatio[1],
      options: peRatios,
      setOption: (value: string, i?: number) =>
        updateFilter('peRatio', value, i),
    },
    {
      id: 'pegRatio',
      label: 'PEG Ratio',
      value: input.pegRatio[0],
      value2: input.pegRatio[1],
      options: pegRatios,
      setOption: (value: string, i?: number) =>
        updateFilter('pegRatio', value, i),
    },
  ]

  const TECHNICAL_FILTERS = [
    {
      id: 'sma50',
      label: 'SMA 50',
      value: input.sma50[0],
      value2: input.sma50[1],
      options: ['-20%'],
      setOption: (value: string, i?: number) => updateFilter('sma50', value, i),
    },
  ]

  const CONFIG = [
    {
      id: 'descriptive',
      name: 'Descriptive',
      description: 'Filters that describe the stock',
      icon: <FileText size={18} />,
      filters: DESCRIPTIVE_FILTERS,
    },
    {
      id: 'fundamental',
      name: 'Fundamental',
      description: 'Filters based on financial statements',
      icon: <Layers size={18} />,
      filters: FUNDAMENTAL_FILTERS,
    },
    {
      id: 'technical',
      name: 'Technical',
      description: "Filters based on the stock's chart",
      icon: <BarChart2 size={18} />,
      filters: TECHNICAL_FILTERS,
    },
  ]

  return (
    <PageLayout className="gap-5">
      <Card className="f-col gap-3 bg-faded border p-4 relative">
        {/* Stock Filters */}
        <Tabs
          aria-label="Filters"
          className="md:f-col"
          defaultValue="descriptive"
        >
          <TabsList className="md:self-center">
            {CONFIG.map((entry) => (
              <TabsTrigger key={entry.id} value={entry.id} className="md:px-4">
                {entry.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button
            size="icon"
            className="absolute top-4 right-4"
            aria-label="Reset filters"
            onClick={() => resetFilters()}
          >
            <RotateCcw size={18} />
          </Button>
          {CONFIG.map((entry) => (
            <TabsContent key={entry.id} value={entry.id}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {entry.filters.map((filter) => (
                  <div className="f-col" key={filter.id + resetCounter}>
                    {filter.value2 && (
                      <Select onValueChange={(e) => filter.setOption(e, 1)}>
                        <Label className="text-xs text-gray-400">
                          {filter.label}
                        </Label>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Any">
                            {filter.value2}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {filter.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                        <p className="text-xs mb-2 text-gray-400">
                          {filter.value2 && 'Minimum Value'}
                        </p>
                      </Select>
                    )}
                    <Select
                      onValueChange={(e) => {
                        filter.setOption(e, filter.value2 ? 0 : undefined)
                      }}
                    >
                      <Label className="text-xs text-gray-400">
                        {filter.label}
                      </Label>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Any">
                          {filter.value}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {filter.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                      <p className="text-xs text-gray-400">
                        {filter.value2 && 'Maximum Value'}
                      </p>
                    </Select>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      {/* Screener Results */}
      {!isFetched ? (
        <Loader className="self-center mt-10" />
      ) : !data?.length ? (
        <p className="text-gray-400 text-sm self-center mt-10">
          No results found.
        </p>
      ) : (
        <Table aria-label="Screener Table">
          <TableHeader>
            <TableRow>
              {SCREENER_TABLE_COLUMNS.map((column) => (
                <TableHead key={column.label}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((stock) => (
              <TableRow key={stock.symbol + 'screener'}>
                <TableCell className="w-0">
                  <Link href={`/stocks/${stock.symbol}`}>
                    <AddStockPortfolio stock={stock} />
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/stocks/${stock.symbol}`}>
                    <SymbolItem stock={stock} />
                  </Link>
                </TableCell>
                <TableCell>{formatMarketCap(stock.mktCap!)}</TableCell>
                <TableCell className="font-semibold">
                  <Badge variant="secondary">{stock.sector}</Badge>
                </TableCell>
                <TableCell>{stock.country}</TableCell>
                <TableCell>{stock.peRatioTTM?.toFixed(2) ?? 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Screener Control */}
      <Pagination>
        <PaginationContent className="mt-2 self-center" aria-label="Pagination">
          <PaginationItem>
            <PaginationPrevious
              href={`/screener?cursor=${cursor >= 1 ? 1 : cursor - 1}&take=${take}`}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={`/screener?cursor=${cursor + 1}&take=${take}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </PageLayout>
  )
}
