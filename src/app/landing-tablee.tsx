"use client";

import SymbolItem from "@/components/stock/symbol-item";
import { DataTable } from "@/components/ui/data-table";
import { StockQuote } from "@/types/stock";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { formatMarketCap } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import AddStockPortfolio from "@/components/stock/add-stock-portfolio";
import { PortfolioWithStocks } from "@/types/db";

interface Props {
  stocks: (StockQuote & { rank: number })[];
  portfolios:
    | Pick<
        PortfolioWithStocks,
        "id" | "title" | "color" | "stocks" | "isPublic"
      >[]
    | undefined;
}

export default function LandingTablee({ stocks, portfolios }: Props) {
  const LANDING_TABLE_COLUMNS: ColumnDef<StockQuote>[] = [
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => (
        <AddStockPortfolio
          stock={row.getValue("symbol")}
          portfolios={portfolios}
        />
      ),
    },
    {
      accessorKey: "rank",
      header: "#",
      cell: ({ row }) => (
        <p className="text-zinc-400">{row.getValue("rank")}</p>
      ),
    },
    {
      accessorKey: "symbol",
      header: "Name",
      cell: ({ row }) => {
        return (
          <SymbolItem
            stock={{
              symbol: row.getValue("symbol"),
              companyName: row.getValue("companyName"),
              image: row.getValue("image"),
            }}
          />
        );
      },
    },
    {
      accessorKey: "companyName",
      header: "",
      cell: ({ row }) => null,
    },
    {
      accessorKey: "image",
      header: "",
      cell: ({ row }) => null,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        return <p className="font-semibold w-5">${price?.toFixed(2)}</p>;
      },
    },
    {
      accessorKey: "changesPercentage",
      header: "24h %",
      cell: ({ row }) => {
        const cp = parseFloat(row.getValue("changesPercentage"));
        return (
          <div className="font-semibold flex items-center gap-1">
            {cp > 0 ? (
              <ArrowBigUp size={16} className="text-price-up" />
            ) : (
              <ArrowBigDown size={16} className="text-price-down" />
            )}
            <span className={`${cp > 0 ? "text-price-up" : "text-price-down"}`}>
              {cp?.toFixed(2).replace("-", "")}%
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "mktCap",
      header: "Market Cap",
      cell: ({ row }) => {
        const mktCap = parseFloat(row.getValue("mktCap"));
        return <p className="font-semibold">{formatMarketCap(mktCap)}</p>;
      },
    },
    {
      accessorKey: "sector",
      header: "Sector",
      cell: ({ row }) => {
        return <Badge variant="outline">{row.getValue("sector")}</Badge>;
      },
    },
  ];

  return <DataTable columns={LANDING_TABLE_COLUMNS} data={stocks} />;
}
