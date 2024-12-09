'use client';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AddStockPortfolio } from '@/features/stock/add-stock-portfolio';
import { formatMarketCap } from '@/lib/utils/stock-helper';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { PortfolioWithQuotes } from '../portfolio/types/portfolio';
import { SymbolItem } from '../stock/components/symbol-item';
import { queryStocks } from './actions/query-stocks';
import { getFiltersFromSearchParams } from './config/filters';
import { SCREENER_TABLE_COLUMNS } from './config/screener-cols';
import { ScreenerColumn, TabsType } from './types/screener';

interface Props {
  portfolios?: Pick<
    PortfolioWithQuotes,
    'id' | 'title' | 'color' | 'orders' | 'isPublic'
  >[];
  filters: ReturnType<typeof getFiltersFromSearchParams>;
  tab: string;
  take: number;
  symbol: string;
  cursor: number;
}

export const ScreenerTable = ({
  portfolios,
  filters,
  tab,
  take,
  symbol,
  cursor,
}: Props) => {
  const columns: ScreenerColumn[] = SCREENER_TABLE_COLUMNS[tab as TabsType];

  const { data, isLoading } = useQuery({
    queryFn: () => queryStocks({ ...filters, cursor, take, symbol }),
    queryKey: ['screener', filters, cursor, take, symbol],
  });

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 11 }, (_, i) => (
          <Skeleton className="my-1.5 h-14 w-full" key={`skeleton-${i}`} />
        ))}
      </>
    );
  }

  if (data?.length === 0) {
    return (
      <div className="f-col mx-auto mt-10 w-72 text-center">
        <h3 className="text-lg font-medium">No results found.</h3>
        <p className="text-center text-sm text-gray-400">
          We couldn&apos;t find what you&apos;re looking for. Try adjusting your
          search terms or filters.
        </p>
      </div>
    );
  }

  return (
    <Table aria-label="Screener Table" className="motion-preset-slide-up-sm">
      <TableHeader>
        <TableRow className="group">
          <TableHead className="group-hover:bg-faded sticky left-0 w-0 bg-background" />
          <TableHead className="group-hover:bg-faded sticky left-[50px] bg-background">
            Name
          </TableHead>
          {columns.map(({ label }) => (
            <TableHead className="whitespace-nowrap text-right" key={label}>
              {label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((stock) => (
          <TableRow key={stock.symbol} className="group">
            <TableCell className="group-hover:bg-faded sticky left-0 bg-background">
              <AddStockPortfolio portfolios={portfolios} stock={stock} />
            </TableCell>
            <TableCell className="group-hover:bg-faded sticky left-[50px] bg-background">
              <Link href={`/stocks/${stock.symbol}`}>
                <SymbolItem
                  stock={stock}
                  className="hidden lg:flex"
                  fullLength
                />
                <SymbolItem stock={stock} className="lg:hidden" />
              </Link>
            </TableCell>
            {columns.map(({ accessor }) => (
              <TableCell key={accessor} className="text-right">
                {renderCellContent(stock, accessor)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const renderCellContent = (
  stock: Awaited<ReturnType<typeof queryStocks>>[0],
  accessor: string,
) => {
  const value = stock[accessor as keyof typeof stock];

  switch (accessor) {
    case 'mktCap': {
      return <p>{formatMarketCap(Number(value))}</p>;
    }
    case 'sector': {
      return (
        <Badge variant="secondary" className="whitespace-nowrap">
          {value ?? '-'}
        </Badge>
      );
    }
    case 'netProfitMarginTTM': {
      return <p>{`${(Number(value) * 100)?.toFixed(2)}%`}</p>;
    }
    default: {
      if (typeof value === 'number') {
        return <p>{value.toFixed(2)}</p>;
      }
      return <p>{value ?? '-'}</p>;
    }
  }
};
