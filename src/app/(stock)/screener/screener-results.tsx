"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  SortDescriptor,
} from "@nextui-org/react";
import StockImage from "@/components/stock/stock-image";
import { formatMarketCap } from "@/lib/utils";
import Link from "next/link";
import AddStockPortfolio from "@/components/stock/add-stock-portfolio";
import { Stock } from "@prisma/client";
import { SCREENER_TABLE_COLUMNS } from "@/config/screener/table";
import { Spinner } from "@nextui-org/react";

interface Props {
  results: Pick<Stock, "symbol" | "companyName" | "image" | "mktCap">[];
  isLoading: boolean;
}

export default function ScreenerResults({ results, isLoading }: Props) {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "symbol",
  });

  const sortedItems = useMemo(() => {
    return results.sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as keyof Stock] as number;
      const second = b[sortDescriptor.column as keyof Stock] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, results]);

  // Single cell for assets table
  const renderCell = useCallback((stock: any, columnKey: string) => {
    switch (columnKey) {
      case "add":
        return "+";
      case "symbol":
        return (
          <div className="flex items-center gap-2.5">
            <StockImage src={stock.image} px={30} />
            <div>
              <p className="max-w-[65px] font-semibold sm:max-w-[200px] truncate">
                {stock.companyName}
              </p>
              <p className="text-sm text-zinc-400">{stock.symbol}</p>
            </div>
          </div>
        );
      case "mktCap":
        return <p className="font-semibold">{formatMarketCap(stock.mktCap)}</p>;
      case "sector":
        return (
          <Chip color="primary" size="sm">
            {stock[columnKey]}
          </Chip>
        );
      case "country":
        return <p>{stock[columnKey]}</p>;
      case "peRatioTTM":
        return <p>{stock[columnKey]?.toFixed(2)}</p>;
      default:
        return null;
    }
  }, []);

  return (
    <Table
      aria-label="Assets Table"
      topContentPlacement="outside"
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}>
      <TableHeader>
        {SCREENER_TABLE_COLUMNS.map((column) => (
          <TableColumn
            key={column.name}
            className="text-sm"
            allowsSorting={column.sortable}>
            {column.label}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody
        emptyContent={"No stocks found."}
        isLoading={isLoading}
        loadingContent={<Spinner />}>
        {sortedItems.map((stock, i) => (
          <TableRow
            key={stock.symbol + i}
            as={Link}
            href={`/stocks/${stock.symbol}`}
            className="hover:bg-zinc-100/50 border-b-1 dark:hover:bg-zinc-800/50 cursor-pointer">
            {SCREENER_TABLE_COLUMNS.map((column) => (
              <TableCell key={column.name}>
                {renderCell(stock, column.name)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
