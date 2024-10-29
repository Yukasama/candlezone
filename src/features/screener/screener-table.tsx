'use client';

import { Loader } from '@/components/loader';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AddStockPortfolio } from '@/features/stock/add-stock-portfolio';
import { cn } from '@/lib/utils';
import { formatMarketCap } from '@/lib/utils/stock-helper';
import { useQuery } from '@tanstack/react-query';
import { User } from 'next-auth';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PortfolioWithQuotes } from '../portfolio/types/portfolio';
import { queryStocks } from '../stock/actions/query-stocks';
import { SymbolItem } from '../stock/components/symbol-item';
import { getFiltersFromSearchParams } from './config/filters';
import { SCREENER_TABLE_COLUMNS } from './config/screener-table-columns';

interface Props {
  portfolios?: Pick<
    PortfolioWithQuotes,
    'id' | 'title' | 'color' | 'orders' | 'isPublic'
  >[];
  user?: User;
}

export const ScreenerTable = ({ portfolios, user }: Props) => {
  const searchParams = useSearchParams();
  const filters = getFiltersFromSearchParams(searchParams);

  const cursor = filters.cursor ?? 1;
  const takeParam = filters.take;
  const take = takeParam && takeParam >= 1 && takeParam <= 50 ? takeParam : 11;

  const { data, isFetching, isLoading } = useQuery({
    queryFn: () => queryStocks({ ...filters, cursor, take }),
    queryKey: ['screener', filters, cursor, take],
  });

  return (
    <div className="f-col col-span-2 min-h-[300px] items-center">
      {data && data.length > 0 ? (
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
              <TableRow key={stock.symbol}>
                <TableCell className="w-0">
                  <AddStockPortfolio
                    portfolios={portfolios}
                    stock={stock}
                    user={user}
                  />
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
      ) : isFetching || isLoading ? (
        <Loader className="mt-10" />
      ) : (
        <div className="f-col mt-10 w-72 items-center">
          <h3 className="text-lg font-medium">No results found.</h3>
          <p className="text-center text-sm text-gray-400">
            We couldn&apos;t find what you&apos;re looking for. Try adjusting
            your search terms or filters.
          </p>
        </div>
      )}

      <Pagination>
        <PaginationContent className="mt-2 self-center" aria-label="Pagination">
          <PaginationItem>
            <PaginationPrevious
              className={cn(cursor === 1 && 'pointer-events-none')}
              href={`/screener?${new URLSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                cursor: Math.max(cursor - 1, 1).toString(),
                take: take.toString(),
              }).toString()}`}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={`/screener?${new URLSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                cursor: (cursor + 1).toString(),
                take: take.toString(),
              }).toString()}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
