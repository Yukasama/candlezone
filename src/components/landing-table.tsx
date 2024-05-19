'use client'

import { useState, useMemo, useCallback } from 'react'
import { Chip } from '@nextui-org/chip'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  SortDescriptor,
} from '@nextui-org/table'
import {
  ArrowBigDown,
  ArrowBigUp,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import { StockQuote } from '@/types/stock'
import { formatMarketCap } from '@/utils/stock-helper'
import { Input } from '@nextui-org/input'
import Link from 'next/link'
import {
  countries,
  exchanges,
  industries,
  sectors,
} from '@/utils/screener/filters'
import { Separator } from '@/components/ui/separator'
import { useSearchParams } from 'next/navigation'
import { PortfolioWithStocks } from '@/types/portfolio'
import { LANDING_TABLE_COLS } from '@/config/landing-table'
import { SymbolItem } from '@/components/stock/symbol-item'
import { Button } from '@/components/ui/button'
import AddStockPortfolio from './stock/add-stock-portfolio'
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

interface Props {
  stocks: StockQuote[]
  portfolios:
    | Pick<
        PortfolioWithStocks,
        'id' | 'title' | 'color' | 'stocks' | 'isPublic'
      >[]
    | undefined
}

export const LandingTable = ({ stocks, portfolios }: Readonly<Props>) => {
  const searchParams = useSearchParams()
  const pageParam = useSearchParams().get('page')

  const [filterValue, setFilterValue] = useState('')
  const [page, setPage] = useState(pageParam ?? '1')
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

  const [rowsPerPage, setRowsPerPage] = useState('50')
  const [showFilters, setShowFilters] = useState(atleastOneFilter ?? false)
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'marketCap',
    direction: 'descending',
  })

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
    return filteredStocks.slice(start, end).map((stock, i) => ({
      ...stock,
      rank: start + i + 1,
    }))
  }, [filteredStocks, page, rowsPerPage])

  const sortedItems = useMemo(() => {
    return [...paginatedStocks].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as keyof StockQuote] as number
      const second = b[sortDescriptor.column as keyof StockQuote] as number
      const cmp1 = first > second ? 1 : 0
      const cmp2 = first < second ? -1 : cmp1

      return sortDescriptor.direction === 'descending' ? -cmp2 : cmp2
    })
  }, [sortDescriptor, paginatedStocks])

  const renderCell = useCallback(
    (stock: any, columnKey: string) => {
      switch (columnKey) {
        case 'rank':
          return <p className="font-semibold text-zinc-400 w-0">{stock.rank}</p>
        case 'symbol':
          return (
            <div className="p-1.5 pr-3">
              <SymbolItem stock={stock} />
            </div>
          )
        case 'price':
          return <p className="font-semibold w-5">${stock.price?.toFixed(2)}</p>
        case 'changesPercentage':
          return (
            <div className="font-semibold flex items-center gap-1">
              {stock.changesPercentage > 0 ? (
                <ArrowBigUp size={16} className="text-price-up" />
              ) : (
                <ArrowBigDown size={16} className="text-price-down" />
              )}
              <span
                className={`${
                  stock.changesPercentage > 0
                    ? 'text-price-up'
                    : 'text-price-down'
                }`}
              >
                {stock.changesPercentage?.toFixed(2).replace('-', '')}%
              </span>
            </div>
          )
        case 'mktCap':
          return (
            <p className="font-semibold">{formatMarketCap(stock.mktCap)}</p>
          )
        case 'sector':
          return (
            <Chip color="primary" size="sm">
              {stock[columnKey]}
            </Chip>
          )
        case 'actions':
          return <AddStockPortfolio stock={stock} portfolios={portfolios} />
        default:
          return null
      }
    },
    [portfolios]
  )

  const onClear = useCallback(() => {
    setFilterValue('')
    setPage('1')
  }, [])

  const topContent = useMemo(() => {
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
        <div className="flex justify-between items-center gap-4">
          <Input
            isClearable
            placeholder="Search by name..."
            className="w-60"
            size="sm"
            labelPlacement="outside"
            aria-label="Search"
            value={filterValue}
            onClear={() => onClear()}
            startContent={<Search size={18} aria-label="Search" />}
            onChange={(e) => setFilterValue(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <p className="hidden md:flex text-sm">Show entries</p>
            <Select
              aria-label="Set rows per page"
              defaultValue={rowsPerPage.toString()}
              onValueChange={setRowsPerPage}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['50', '100'].map((value) => (
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
        <div className={`${showFilters ? 'f-col gap-2' : 'hidden'}`}>
          <Separator />
          <div className="grid grid-cols-2 sm:flex items-center gap-4">
            {filters.map((filter) => (
              <Select
                key={filter.label}
                aria-label="Select Filter"
                onValueChange={filter.setter}
              >
                <div className="w-full max-w-52">
                  <Label>{filter.label}</Label>
                  <SelectTrigger>
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
          <Separator />
        </div>
      </div>
    )
  }, [
    filterValue,
    onClear,
    showFilters,
    rowsPerPage,
    sector,
    industry,
    country,
    exchange,
  ])

  return (
    <>
      <Table
        aria-label="Assets Table"
        removeWrapper
        topContent={topContent}
        topContentPlacement="outside"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader>
          {LANDING_TABLE_COLS.map((column) => (
            <TableColumn
              key={column.key}
              allowsSorting={column.sortable}
              className="text-sm"
            >
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent={'No stocks found'}>
          {sortedItems.map((stock) => (
            <TableRow
              key={stock.symbol}
              as={Link}
              href={`/stocks/${stock.symbol}`}
              className="hover:bg-zinc-100/50 border-b-1 dark:hover:bg-zinc-800/50 cursor-pointer"
            >
              {LANDING_TABLE_COLS.map((column) => (
                <TableCell key={column.key}>
                  {renderCell(stock, column.key)}
                </TableCell>
              ))}
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
    </>
  )
}
