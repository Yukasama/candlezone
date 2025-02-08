'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NewOrderModal } from '@/features/order/new-order-modal';
import { PortfolioWithQuotes } from '@/features/portfolio/types/portfolio';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { StockQuote } from '@/features/stock/types/stock';
import {
  countries,
  exchanges,
  industries,
  sectors,
} from '@/lib/fmp/data/filters';
import { cn } from '@/lib/utils';
import { formatMarketCap } from '@/lib/utils/stock-helper';
import {
  ArrowBigDown,
  ArrowBigUp,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useMemo, useState } from 'react';
import { LANDING_TABLE_COLS } from './config/landing-table-cols';

interface Props {
  stocks: (StockQuote & { rank: number })[];
  portfolios?: PortfolioWithQuotes[];
}

export const StockTable = ({ stocks, portfolios }: Readonly<Props>) => {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ?? '1';
  const [rowsPerPage, setRowsPerPage] = useState('30');
  const [showFilters, setShowFilters] = useState(
    !!searchParams.get('sector') ||
      !!searchParams.get('industry') ||
      !!searchParams.get('country') ||
      !!searchParams.get('exchange'),
  );

  const [filterValue, setFilterValue] = useState('');
  const [sector, setSector] = useState(searchParams.get('sector') ?? 'Any');
  const [industry, setIndustry] = useQueryState('industry', {
    defaultValue: 'Any',
  });
  const [country, setCountry] = useState(searchParams.get('country') ?? 'Any');
  const [exchange, setExchange] = useState(
    searchParams.get('exchange') ?? 'Any',
  );

  const filteredStocks = useMemo(() => {
    const lowercaseFilterValue = filterValue.toLowerCase();

    return stocks
      .filter(({ sector, industry, country, exchange, name, symbol }) => {
        const sectorMatch = !sector || sector === 'Any' || Number.isNaN(sector);
        const industryMatch =
          !industry || industry === 'Any' || Number.isNaN(industry);
        const countryMatch =
          !country || country === 'Any' || Number.isNaN(country);
        const exchangeMatch =
          !exchange || exchange === 'Any' || Number.isNaN(exchange);
        const searchMatch =
          name?.toLowerCase().includes(lowercaseFilterValue) ??
          symbol.toLowerCase().includes(lowercaseFilterValue);

        return (
          sectorMatch &&
          industryMatch &&
          countryMatch &&
          exchangeMatch &&
          searchMatch
        );
      })
      .sort((a, b) => (b.mktCap ?? 0) - (a.mktCap ?? 0));
  }, [stocks, filterValue]);

  const paginatedStocks = useMemo(() => {
    const start = (Number(page) - 1) * Number(rowsPerPage);
    const end = start + Number(rowsPerPage);
    return filteredStocks.slice(start, end);
  }, [filteredStocks, page, rowsPerPage]);

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
      options: Object.keys(countries),
    },
    {
      label: 'Exchange',
      value: exchange,
      setter: setExchange,
      options: exchanges,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <div className="bg-faded flex h-10 items-center gap-1 rounded-full border px-1 pr-4">
            <Input
              placeholder="Search by name..."
              className="h-full border-none bg-inherit"
              value={filterValue}
              onChange={(e) => {
                setFilterValue(e.target.value);
              }}
            />
            <Search size={18} aria-label="Search" className="text-gray-400" />
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden text-sm md:flex">Show entries</p>
            <Select
              defaultValue={rowsPerPage.toString()}
              onValueChange={setRowsPerPage}
            >
              <SelectTrigger
                aria-label="Set rows per page"
                className="h-9 w-20 rounded-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['30', '100'].map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                setShowFilters((prev) => !prev);
              }}
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
            {filters.map(({ label, value, setter, options }) => (
              <Select
                key={label}
                defaultValue={value}
                aria-label="Select Filter"
                onValueChange={setter}
              >
                <div className="w-full max-w-60">
                  <Label className="text-xs text-gray-400">{label}</Label>
                  <SelectTrigger className="h-9" aria-label="Select Filter">
                    <SelectValue>{value}</SelectValue>
                  </SelectTrigger>
                </div>
                <SelectContent>
                  {options.map((value) => (
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
            {LANDING_TABLE_COLS.map(({ key, name }) => (
              <TableHead key={key}>{name}</TableHead>
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
                <div className="flex items-center gap-1 font-semibold">
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
                {formatMarketCap(stock.mktCap)}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{stock.sector}</Badge>
              </TableCell>
              <TableCell>
                <NewOrderModal portfolios={portfolios} stock={stock} />
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
  );
};
