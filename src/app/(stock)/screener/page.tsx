'use client'

import { useState, useEffect } from 'react'
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
import { Button } from '@nextui-org/button'
import { Tabs, Tab } from '@nextui-org/tabs'
import { Select, SelectItem } from '@nextui-org/select'
import {
  BarChart2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers,
  RotateCcw,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ScreenerProps } from '@/lib/validators/stock'
import ScreenerResults from '@/components/stock/screener-results'
import { PageLayout } from '@/components/shared/page-layout'
import { useQuery } from '@tanstack/react-query'
import { queryStocks } from '@/actions/stock/query-stocks'

interface Props {
  searchParams: { [key: string]: string | string[] | undefined }
}

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

export default function Screener({ searchParams }: Readonly<Props>) {
  const [resetCounter, setResetCounter] = useState(0)
  const [input, setInput] = useState<ScreenerProps>(DEFAULT_STATE)
  const router = useRouter()

  // Cursor defines the current page of the pagination
  const cursor =
    typeof searchParams['cursor'] === 'string'
      ? Number(searchParams['cursor'])
      : 1

  // Take defines how much stocks are being shown per pagination,
  // must be between 1 and 50, otherwise set to 10
  const takeParam =
    (typeof searchParams['take'] === 'string' &&
      Number(searchParams['take'])) ??
    10
  const take = takeParam && takeParam >= 1 && takeParam <= 50 ? takeParam : 10

  useEffect(() => {
    refetch()
    router.replace(`/screener?cursor=${cursor}&take=${take}`)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, cursor, take])

  const {
    data: results,
    isFetched,
    refetch,
  } = useQuery({
    queryFn: async () => await queryStocks({ ...input, cursor, take }),
    queryKey: ['screener', input, cursor, take],
  })

  function updateFilter(
    filterId: keyof typeof DEFAULT_STATE,
    newValue: string,
    i: number | null = null
  ) {
    setInput((prev) => {
      if (i !== null && Array.isArray(prev[filterId])) {
        const updatedTuple = prev[filterId] as [string, string]
        updatedTuple[i] = newValue
        return {
          ...prev,
          [filterId]: updatedTuple,
        }
      } else {
        return {
          ...prev,
          [filterId]: newValue,
        }
      }
    })
  }

  // Set all filters on "Any" on reset button click
  function resetFilters() {
    setInput(DEFAULT_STATE)
    setResetCounter((prev) => prev + 1)
    router.replace(`/screener?cursor=1&take=${take}`)
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
      <div className="f-col gap-2">
        {/* Stock Filters */}
        <Tabs
          aria-label="Filters"
          color="primary"
          className="self-center"
          radius="full"
        >
          {CONFIG.map((entry) => (
            <Tab
              key={entry.id}
              title={
                <div className="flex items-center gap-2">
                  {entry.icon}
                  {entry.name}
                </div>
              }
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {entry.filters.map((filter) => (
                  <div className="f-col" key={filter.id + resetCounter}>
                    {filter.value2 && (
                      <Select
                        size="sm"
                        variant="bordered"
                        placeholder="Any"
                        label={filter.label}
                        onChange={(e) => filter.setOption(e.target.value, 1)}
                        value={filter.value2}
                        description={filter.value2 && 'Minimum Value'}
                      >
                        {filter.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                    <Select
                      onChange={(e) => {
                        filter.setOption(
                          e.target.value,
                          filter.value2 ? 0 : undefined
                        )
                      }}
                      size="sm"
                      variant="bordered"
                      label={filter.label}
                      placeholder="Any"
                      value={filter.value}
                      description={filter.value2 && 'Maximum Value'}
                    >
                      {filter.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                ))}
              </div>
            </Tab>
          ))}
        </Tabs>
      </div>

      {/* Screener Results */}
      <div className="f-col">
        <Tabs
          aria-label="Options"
          color="primary"
          className="self-center"
          radius="full"
        >
          {CONFIG.map((entry) => (
            <Tab
              key={entry.id}
              title={
                <div className="flex items-center gap-2">
                  {entry.icon}
                  {entry.name}
                </div>
              }
            >
              {results && (
                <ScreenerResults results={results} isLoading={!isFetched} />
              )}
            </Tab>
          ))}
        </Tabs>
        <Button
          color="danger"
          size="sm"
          isIconOnly
          aria-label="Reset filters"
          startContent={<RotateCcw size={18} />}
          onClick={() => resetFilters()}
        />

        {/* Screener Control */}
        {isFetched && results?.length ? (
          <div className="flex gap-3.5 justify-center">
            <Button
              aria-label="Previous page"
              onClick={() =>
                router.push(
                  `/screener?cursor=${
                    cursor >= 1 ? 1 : cursor - 1
                  }&take=${take}`
                )
              }
              className={`${cursor <= 1 && 'pointer-events-none opacity-80'}`}
            >
              <ChevronLeft size={18} />
              Previous
            </Button>
            <Button
              onClick={() =>
                router.push(`/screener?cursor=${cursor + 1}&take=${take}`)
              }
              color="primary"
              aria-label="Next page"
            >
              Next
              <ChevronRight size={18} />
            </Button>
          </div>
        ) : null}
      </div>
    </PageLayout>
  )
}
