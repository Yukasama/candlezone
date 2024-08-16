'use client'

import { SymbolItem } from '@/components/stock/symbol-item'
import { Button } from '@/components/ui/button'
import { LANDING_TABLE_COLS } from '@/config/landing-table'
import { cn } from '@/lib/utils'
import { PortfolioWithStockIds } from '@/types/portfolio'
import { StockQuote } from '@/types/stock'
import {
  countries,
  exchanges,
  industries,
  sectors,
} from '@/utils/screener/filters'
import { formatMarketCap } from '@/utils/stock-helper'
import {
  ArrowBigDown,
  ArrowBigUp,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { AddStockPortfolio } from './stock/add-stock-portfolio'

interface Props {
  stocks: (StockQuote & { rank: number })[]
  portfolios?: Pick<
    PortfolioWithStockIds,
    'id' | 'title' | 'color' | 'stocks' | 'isPublic'
  >[]
}

export const LandingTable = ({ stocks, portfolios }: Readonly<Props>) => {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') ?? '1'
  const [rowsPerPage, setRowsPerPage] = useState('30')
  const [showFilters, setShowFilters] = useState(
    !!searchParams.get('sector') ||
      !!searchParams.get('industry') ||
      !!searchParams.get('country') ||
      !!searchParams.get('exchange'),
  )

  const [filterValue, setFilterValue] = useState('')
  const [sector, setSector] = useState(searchParams.get('sector') ?? 'Any')
  const [industry, setIndustry] = useState(
    searchParams.get('industry') ?? 'Any',
  )
  const [country, setCountry] = useState(searchParams.get('country') ?? 'Any')
  const [exchange, setExchange] = useState(
    searchParams.get('exchange') ?? 'Any',
  )

  const filteredStocks = useMemo(() => {
    const lowercaseFilterValue = filterValue.toLowerCase()

    return stocks
      .filter((stock) => {
        const sectorMatch =
          !sector || sector === 'Any' || stock.sector === sector
        const industryMatch =
          !industry || industry === 'Any' || stock.industry === industry
        const countryMatch =
          !country || country === 'Any' || stock.country === country
        const exchangeMatch =
          !exchange || exchange === 'Any' || stock.exchange === exchange
        const searchMatch =
          stock.name?.toLowerCase().includes(lowercaseFilterValue) ??
          stock.symbol.toLowerCase().includes(lowercaseFilterValue)

        return (
          sectorMatch &&
          industryMatch &&
          countryMatch &&
          exchangeMatch &&
          searchMatch
        )
      })
      .sort((a, b) => b.mktCap! - a.mktCap!)
  }, [stocks, filterValue, sector, industry, country, exchange])

  const paginatedStocks = useMemo(() => {
    const start = (Number(page) - 1) * Number(rowsPerPage)
    const end = start + Number(rowsPerPage)
    return filteredStocks.slice(start, end)
  }, [filteredStocks, page, rowsPerPage])

  const filters = [
    {
      label: 'Sector',
      value: sector,
      setter: setSector,
      options: sectors,
    },
    {
      label: 'Industry',
      value: industry,
      setter: setIndustry,
      options: industries,
    },
    {
      label: 'Country',
      value: country,
      setter: setCountry,
      options: countries,
    },
    {
      label: 'Exchange',
      value: exchange,
      setter: setExchange,
      options: exchanges,
    },
  ]

  return (
    <div className="f-col gap-3">
      <div className="f-col gap-1">
        <div className="f-center justify-between gap-4">
          <div className="bg-faded flex h-9 w-60 items-center gap-1 rounded-md border pr-3">
            <Input
              placeholder="Search by name..."
              className="bg-faded h-full w-full border-none"
              aria-label="Search"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            <Search size={18} aria-label="Search" />
          </div>
          <div className="f-center gap-3">
            <p className="hidden text-sm md:flex">Show entries</p>
            <Select
              defaultValue={rowsPerPage.toString()}
              onValueChange={setRowsPerPage}
            >
              <SelectTrigger
                aria-label="Set rows per page"
                className="h-9 w-20"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-faded">
                {['30', '100'].map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => setShowFilters((prev) => !prev)}
              aria-label="Show filters"
              variant="secondary"
              size="sm"
            >
              <SlidersHorizontal size={18} />
              Filters
            </Button>
          </div>
        </div>

        <div className={cn(!showFilters && 'hidden')}>
          <div className="grid grid-cols-2 items-center gap-4 sm:flex">
            {filters.map((filter) => (
              <Select
                key={filter.label}
                defaultValue={filter.value}
                aria-label="Select Filter"
                onValueChange={filter.setter}
              >
                <div className="w-full max-w-60">
                  <Label className="text-xs text-gray-400">
                    {filter.label}
                  </Label>
                  <SelectTrigger className="h-9" aria-label="Select Filter">
                    <SelectValue>{filter.value}</SelectValue>
                  </SelectTrigger>
                </div>
                <SelectContent>
                  {filter.options.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        </div>
      </div>

      <Table aria-label="Landing Table">
        <TableHeader>
          <TableRow>
            {LANDING_TABLE_COLS.map((column) => (
              <TableHead key={column.key}>{column.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedStocks.map((stock) => (
            <TableRow key={stock.symbol}>
              <TableCell className="w-0 font-semibold text-gray-400">
                {stock.rank}
              </TableCell>
              <TableCell>
                <Link href={`/stocks/${stock.symbol}`}>
                  <SymbolItem stock={stock} />
                </Link>
              </TableCell>
              <TableCell className="w-5 font-semibold">
                ${stock.price?.toFixed(2) ?? 'N/A'}
              </TableCell>
              <TableCell>
                <div className="f-center gap-1 font-semibold">
                  {(stock.changesPercentage ?? 0) >= 0 ? (
                    <ArrowBigUp size={16} className="text-price-up" />
                  ) : (
                    <ArrowBigDown size={16} className="text-price-down" />
                  )}
                  <span
                    className={cn(
                      (stock.changesPercentage ?? 0) >= 0
                        ? 'text-price-up'
                        : 'text-price-down',
                    )}
                  >
                    {stock.changesPercentage?.toFixed(2).replace('-', '') ??
                      'N/A'}
                    %
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-semibold">
                {formatMarketCap(stock.mktCap!)}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{stock.sector}</Badge>
              </TableCell>
              <TableCell>
                <AddStockPortfolio stock={stock} portfolios={portfolios} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent className="mt-2 self-center" aria-label="Pagination">
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
