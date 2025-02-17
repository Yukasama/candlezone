'use client';

import { StockCard } from '@/app/stock-card';
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
import { formatMarketCap } from '@/lib/utils/stock-helper';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { NewOrderModal } from '../order/new-order-modal';
import { PortfolioWithQuotes } from '../portfolio/types/portfolio';
import { queryStocks } from './actions/query-stocks';
import { SCREENER_TABLE_COLUMNS } from './config/screener-cols';
import { getFiltersFromSearchParams } from './lib/get-filters';
import { ScreenerColumn, TabsType } from './types/screener';

interface Props {
  cursor: number;
  filters: ReturnType<typeof getFiltersFromSearchParams>;
  portfolios?: PortfolioWithQuotes[];
  symbol: string;
  tab: string;
  take: number;
}

export const ScreenerResults = ({
  cursor,
  filters,
  portfolios,
  symbol,
  tab,
  take,
}: Props) => {
  const columns: ScreenerColumn[] = SCREENER_TABLE_COLUMNS[tab as TabsType];

  const { data, isLoading } = useQuery({
    queryFn: () => queryStocks({ ...filters, cursor, symbol, take }),
    queryKey: ['screener', filters, cursor, take, symbol],
  });

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 11 }, (_, i) => (
          <Skeleton
            className="my-1.5 h-14 w-full"
            key={`skeleton-${String(i)}`}
          />
        ))}
      </>
    );
  }

  if (data?.length === 0) {
    return (
      <div className="mx-auto mt-10 flex w-72 flex-col text-center">
        <strong className="text-lg font-medium">No results found.</strong>
        <p className="text-desc text-center text-sm">
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
          <TableHead className="bg-background group-hover:bg-accent/1 sticky left-0 w-0" />
          <TableHead className="bg-background group-hover:bg-accent/1 sticky left-[50px]">
            Name
          </TableHead>
          {columns.map(({ label }) => (
            <TableHead className="text-right whitespace-nowrap" key={label}>
              {label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((stock) => (
          <TableRow className="group" key={stock.symbol}>
            <TableCell className="bg-background group-hover:bg-accent/1 sticky left-0">
              <NewOrderModal portfolios={portfolios} stock={stock} />
            </TableCell>
            <TableCell className="bg-background group-hover:bg-accent/1 sticky left-[50px]">
              <Link href={`/stocks/${stock.symbol}`}>
                <StockCard stock={stock} />
              </Link>
            </TableCell>
            {columns.map(({ accessor }) => (
              <TableCell className="text-right" key={accessor}>
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
    case 'marketCap': {
      return <p>{formatMarketCap(Number(value))}</p>;
    }
    case 'netProfitMarginTTM': {
      return <p>{`${(Number(value) * 100).toFixed(2)}%`}</p>;
    }
    case 'sector': {
      return (
        <Badge className="whitespace-nowrap" variant="secondary">
          {value ?? '-'}
        </Badge>
      );
    }
    default: {
      if (typeof value === 'number') {
        return <p>{value.toFixed(2)}</p>;
      }
      return <p>{value ?? '-'}</p>;
    }
  }
};
