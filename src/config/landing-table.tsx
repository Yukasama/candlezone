"use client";

import { StockQuote } from "@/types/stock";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { formatMarketCap } from "@/lib/utils";

export const getLandingTableColumns = (
  data: StockQuote[]
): ColumnDef<StockQuote>[] => {
  return [
    {
      accessorKey: "rank",
      header: "#",
    },
    {
      accessorKey: "symbol",
      header: "Name",
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
    },
    {
      accessorKey: "actions",
      header: "",
    },
  ];
};
