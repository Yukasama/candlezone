"use server";

import { getQuotes } from "../quote/quote";
import { MarketCapStock } from "@/types/stock";
import { env } from "@/env.mjs";
import { db } from "@/lib/db";

export const getMarketCap = async () => {
  const orderedByMktCap: MarketCapStock[] = await fetch(
    `https://financialmodelingprep.com/api/v3/stock-screener?apikey=${env.FMP_API_KEY}`,
    { cache: "force-cache" },
  ).then((res) => res.json());

  const filteredData = orderedByMktCap
    .filter(
      (stock) =>
        !stock.isEtf &&
        !stock.isFund &&
        stock.symbol !== "GOOGL" &&
        stock.symbol !== "BRK-A" &&
        stock.isActivelyTrading &&
        stock.exchangeShortName !== "EURONEXT",
    )
    .slice(0, 1700);

  const [stocks, quotes] = await Promise.all([
    db.stock.findMany({
      select: { symbol: true, image: true },
      where: { symbol: { in: filteredData.map((stock: any) => stock.symbol) } },
    }),
    getQuotes(filteredData.map((stock: any) => stock.symbol)),
  ]);

  return filteredData.map((stock: any) => {
    const stockQuote = quotes?.find((quote) => quote.symbol === stock.symbol);
    return {
      symbol: stock.symbol,
      marketCap: stock.marketCap,
      price: stock.price,
      sector: stock.sector,
      industry: stock.industry,
      companyName: stock.companyName,
      exchange: stock.exchangeShortName,
      country: stock.country,
      changesPercentage: stockQuote?.changesPercentage,
    };
  });
};
