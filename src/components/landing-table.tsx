'use client'

import { useMemo, useState } from 'react'
import {
  ArrowBigDown,
  ArrowBigUp,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import { StockQuote } from '@/types/stock'
import { formatMarketCap } from '@/utils/stock-helper'
import Link from 'next/link'
import {
  countries,
  exchanges,
  industries,
  sectors,
} from '@/utils/screener/filters'
import { useSearchParams } from 'next/navigation'
import { PortfolioWithStocks } from '@/types/portfolio'
import { LANDING_TABLE_COLS } from '@/config/landing-table'
import { SymbolItem } from '@/components/stock/symbol-item'
import { Button } from '@/components/ui/button'
import { AddStockPortfolio } from './stock/add-stock-portfolio'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Label } from './ui/label'
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationItem,
} from './ui/pagination'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

interface Props {
  stocks: (StockQuote & { rank: number })[]
  portfolios?: Pick<
    PortfolioWithStocks,
    'id' | 'title' | 'color' | 'stocks' | 'isPublic'
  >[]
}

export const LandingTable = ({ stocks, portfolios }: Readonly<Props>) => {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') ?? '1'

  const [filterValue, setFilterValue] = useState('')
  const [sector, setSector] = useState(searchParams.get('sector') ?? 'Any')
  const [industry, setIndustry] = useState(
    searchParams.get('industry') ?? 'Any'
  )
  const [country, setCountry] = useState(searchParams.get('country') ?? 'Any')
  const [exchange, setExchange] = useState(
    searchParams.get('exchange') ?? 'Any'
  )

  const atleastOneFilter =
    sector !== 'Any' ||
    industry !== 'Any' ||
    country !== 'Any' ||
    exchange !== 'Any'

  const [rowsPerPage, setRowsPerPage] = useState('30')
  const [showFilters, setShowFilters] = useState(atleastOneFilter ?? false)
  // const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
  //   column: 'marketCap',
  //   direction: 'descending',
  // })

  // Filtering and sorting stocks
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
          stock.name?.toLowerCase().includes(lowercaseFilterValue) ||
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

  // Slicing stocks for pagination
  const paginatedStocks = useMemo(() => {
    const start = (Number(page) - 1) * Number(rowsPerPage)
    const end = start + Number(rowsPerPage)
    return filteredStocks.slice(start, end)
  }, [filteredStocks, page, rowsPerPage])

  // const sortedItems = useMemo(() => {
  //   return [...paginatedStocks].sort((a: any, b: any) => {
  //     const first = a[sortDescriptor.column as keyof StockQuote] as number
  //     const second = b[sortDescriptor.column as keyof StockQuote] as number
  //     const cmp1 = first > second ? 1 : 0
  //     const cmp2 = first < second ? -1 : cmp1

  //     return sortDescriptor.direction === 'descending' ? -cmp2 : cmp2
  //   })
  // }, [sortDescriptor, paginatedStocks])

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
        <div className="flex justify-between items-center gap-4">
          <div className="flex gap-1 bg-faded items-center pr-3 rounded-md w-60 h-9 border">
            <Input
              placeholder="Search by name..."
              className="border-none w-full h-full bg-faded"
              aria-label="Search"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            <Search size={18} aria-label="Search" />
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden md:flex text-sm">Show entries</p>
            <Select
              aria-label="Set rows per page"
              defaultValue={rowsPerPage.toString()}
              onValueChange={setRowsPerPage}
            >
              <SelectTrigger className="w-20 h-9">
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
              aria-label="Filters"
              variant="secondary"
              size="sm"
            >
              <SlidersHorizontal size={18} />
              Filters
            </Button>
          </div>
        </div>

        <div className={`${!showFilters && 'hidden'}`}>
          <div className="grid grid-cols-2 sm:flex items-center gap-4">
            {filters.map((filter) => (
              <Select
                key={filter.label}
                aria-label="Select Filter"
                onValueChange={filter.setter}
              >
                <div className="w-full max-w-60">
                  <Label className="text-xs text-zinc-400">
                    {filter.label}
                  </Label>
                  <SelectTrigger className="h-9">
                    <SelectValue>{filter.value}</SelectValue>
                  </SelectTrigger>
                </div>
                <SelectContent>
                  {sectors.map((value) => (
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
              <TableCell className="font-semibold text-zinc-400 w-0">
                {stock.rank}
              </TableCell>
              <TableCell>
                <Link href={`/stocks/${stock.symbol}`}>
                  <SymbolItem stock={stock} />
                </Link>
              </TableCell>
              <TableCell className="font-semibold w-5">
                ${stock.price?.toFixed(2) ?? 'N/A'}
              </TableCell>
              <TableCell>
                <div className="font-semibold flex items-center gap-1">
                  {(stock.changesPercentage ?? 0) >= 0 ? (
                    <ArrowBigUp size={16} className="text-price-up" />
                  ) : (
                    <ArrowBigDown size={16} className="text-price-down" />
                  )}
                  <span
                    className={`${
                      (stock.changesPercentage ?? 0) >= 0
                        ? 'text-price-up'
                        : 'text-price-down'
                    }`}
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
