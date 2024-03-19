"use client";

import { DataTable } from "@/components/ui/data-table";
import { LANDING_TABLE_COLUMNS } from "@/config/landing-table";
import { PortfolioWithStocks } from "@/types/db";
import { MarketCapQuote } from "@/types/stock";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface Props {
  stocks: MarketCapQuote[];
  portfolios:
    | Pick<
        PortfolioWithStocks,
        "id" | "title" | "color" | "stocks" | "isPublic"
      >[]
    | undefined;
}

export default function LandingTablee({ stocks, portfolios }: Props) {
  const searchParams = useSearchParams();
  const pageParam = useSearchParams().get("page");

  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(pageParam ? Number(pageParam) : 1);
  const [sector, setSector] = useState(searchParams.get("sector") ?? "Any");
  const [industry, setIndustry] = useState(
    searchParams.get("industry") ?? "Any"
  );
  const [country, setCountry] = useState(searchParams.get("country") ?? "Any");
  const [exchange, setExchange] = useState(
    searchParams.get("exchange") ?? "Any"
  );

  const atleastOneFilter =
    sector !== "Any" ||
    industry !== "Any" ||
    country !== "Any" ||
    exchange !== "Any";

  return <DataTable columns={LANDING_TABLE_COLUMNS} data={stocks} />;
}
