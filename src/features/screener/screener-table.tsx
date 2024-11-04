'use client';

import { Badge } from '@/components/ui/badge';
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
import Link from 'next/link';
import { PortfolioWithQuotes } from '../portfolio/types/portfolio';
import { SymbolItem } from '../stock/components/symbol-item';
import { queryStocks } from './actions/query-stocks';
import { SCREENER_TABLE_COLUMNS } from './config/screener-cols';
import { ScreenerColumn, TabsType } from './types/screener';

interface Props {
  data: Awaited<ReturnType<typeof queryStocks>>;
  portfolios?: Pick<
    PortfolioWithQuotes,
    'id' | 'title' | 'color' | 'orders' | 'isPublic'
  >[];
  tab: string;
}

export const ScreenerTable = ({ data, portfolios, tab }: Props) => {
  const columns: ScreenerColumn[] = SCREENER_TABLE_COLUMNS[tab as TabsType];

  return (
    <Table aria-label="Screener Table">
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

  if (accessor === 'mktCap') {
    return formatMarketCap(value as number);
  } else if (accessor === 'sector') {
    return (
      <Badge variant="secondary" className="whitespace-nowrap">
        {value}
      </Badge>
    );
  } else if (typeof value === 'number') {
    return value.toFixed(2);
  } else {
    return value ?? '-';
  }
};
