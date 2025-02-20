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
import { StockCard } from '@/features/stock/components/stock-card';
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
  portfolios?: PortfolioWithQuotes[];
  stocks: (StockQuote & { rank: number })[];
}

export const StockTable = ({ portfolios, stocks }: Readonly<Props>) => {
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
      .filter(({ country, exchange, industry, name, sector, symbol }) => {
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
      .sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0));
  }, [stocks, filterValue]);

  const paginatedStocks = useMemo(() => {
    const start = (Number(page) - 1) * Number(rowsPerPage);
    const end = start + Number(rowsPerPage);
    return filteredStocks.slice(start, end);
  }, [filteredStocks, page, rowsPerPage]);

  const filters = [
    {
      label: 'Sector',
      options: sectors,
      setter: setSector,
      value: sector,
    },
    {
      label: 'Industry',
      options: industries,
      setter: setIndustry,
      value: industry,
    },
    {
      label: 'Country',
      options: Object.keys(countries),
      setter: setCountry,
      value: country,
    },
    {
      label: 'Exchange',
      options: exchanges,
      setter: setExchange,
      value: exchange,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <div className="bg-faded flex h-10 items-center gap-1 rounded-full border px-1 pr-4">
            <Input
              className="h-full border-none bg-inherit"
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder="Search by name..."
              value={filterValue}
            />
            <Search aria-label="Search" className="text-desc" size={18} />
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
              onClick={() => setShowFilters((prev) => !prev)}
              size="sm"
              variant="secondary"
            >
              <SlidersHorizontal size={18} />
              Filters
            </Button>
          </div>
        </div>

        <div className={cn(!showFilters && 'hidden')}>
          <div className="grid grid-cols-2 items-center gap-4 sm:flex">
            {filters.map(({ label, options, setter, value }) => (
              <Select
                aria-label="Select Filter"
                defaultValue={value}
                key={label}
                onValueChange={setter}
              >
                <div className="w-full max-w-60">
                  <Label className="text-desc text-xs">{label}</Label>
                  <SelectTrigger aria-label="Select Filter" className="h-9">
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
              <TableCell className="text-desc w-0 font-semibold">
                {stock.rank}
              </TableCell>
              <TableCell>
                <Link href={`/stocks/${stock.symbol}`}>
                  <StockCard stock={stock} />
                </Link>
              </TableCell>
              <TableCell className="w-5 font-semibold">
                ${stock.price?.toFixed(2) ?? 'N/A'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 font-semibold">
                  {(stock.changesPercentage ?? 0) >= 0 ? (
                    <ArrowBigUp className="text-price-up" size={16} />
                  ) : (
                    <ArrowBigDown className="text-price-down" size={16} />
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
                {formatMarketCap(stock.marketCap)}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{stock.sector}</Badge>
              </TableCell>
              <TableCell>
                <NewOrderModal
                  portfolios={portfolios}
                  stock={{
                    ...stock,
                    image: stock.image ?? '',
                    range: stock.range ?? '',
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent aria-label="Pagination" className="mt-2 self-center">
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
