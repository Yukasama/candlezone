import "server-only";
import { FMP_API_URL, FMP } from "@/config/fmp/config";
import { QUOTE_SIMULATION } from "@/config/fmp/simulation";
import { env } from "@/env.mjs";
import { Quote } from "@/types/stock";
import { Stock } from "@prisma/client";

export const getQuote = async (symbol?: string, allFields?: boolean) => {
  if (FMP.simulation) {
    return QUOTE_SIMULATION;
  }

  if (!symbol) {
    return undefined;
  }

  const url = `${FMP_API_URL}v3/quote/${symbol}?apikey=${env.FMP_API_KEY}`;

  // Quote comes back as array
  const data = (
    await fetch(url, { next: { revalidate: 30 } }).then((res) => res.json())
  )[0] as Quote;

  if (allFields) {
    return data;
  }

  return {
    symbol: data.symbol,
    name: data.name,
    price: data.price,
    changesPercentage: data.changesPercentage,
    pe: data.pe,
    eps: data.eps,
  };
};

export const getQuotes = async (symbols?: string[], allFields?: boolean) => {
  if (FMP.simulation) {
    return [
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
    ];
  }

  if (!symbols) {
    return undefined;
  }

  const url = `${FMP_API_URL}v3/quote/${symbols.join(",")}?apikey=${
    env.FMP_API_KEY
  }`;

  const result = (await fetch(url).then((res) => res.json())) as Quote[];

  if (allFields) {
    return result;
  }

  return result?.map((res) => {
    return {
      symbol: res.symbol,
      name: res.name,
      price: res.price,
      changesPercentage: res.changesPercentage,
      pe: res.pe,
      eps: res.eps,
    };
  });
};

export const getAfterHoursQuote = async (symbol?: string) => {
  if (FMP.simulation) {
    return QUOTE_SIMULATION;
  }

  if (!symbol) {
    return undefined;
  }

  const url = `${FMP_API_URL}v4/pre-post-market-trade/${symbol}?apikey=${env.FMP_API_KEY}`;

  const data = await fetch(url, { next: { revalidate: 30 } }).then((res) =>
    res.json()
  );

  return {
    symbol: data.symbol,
    price: data.price,
  };
};

export const getStockQuotes = async (
  stocks: Pick<Stock, "symbol" | "companyName">[]
) => {
  const quotes = await getQuotes(stocks.map((stock) => stock.symbol));

  const results = stocks.map((stock) => ({
    ...stock,
    ...quotes?.find((q) => q.symbol === stock.symbol)!,
  }));

  return results;
};
