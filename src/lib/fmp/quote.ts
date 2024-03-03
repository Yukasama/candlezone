import "server-only";

import { FMP_API_URL, FMP, FMP_URLS } from "@/config/fmp/config";
import { indexQuotes, quote } from "@/config/fmp/simulation";
import { env } from "@/env.mjs";
import { AfterHoursQuote, Quote } from "@/types/stock";
import { Stock } from "@prisma/client";
import { StockQuote } from "@/types/stock";

export async function getDailys(
  action: "actives" | "winners" | "losers"
): Promise<Quote[] | undefined> {
  try {
    if (FMP.simulation) {
      return [quote, quote, quote, quote, quote];
    }

    const response = await fetch(FMP_URLS[action], {
      next: { revalidate: 30 },
    }).then((res) => res.json());

    // Filtering all none-ETFs and stocks with "-" in their symbol
    const symbols = response.filter(
      (item: Quote) =>
        item.name &&
        !item.symbol.includes("-") &&
        !item.name.includes("ProShares")
    );

    return symbols;
  } catch {
    return undefined;
  }
}

export async function getIndexQuotes(
  allFields?: boolean
): Promise<Quote[] | undefined> {
  try {
    if (FMP.simulation) {
      return indexQuotes;
    }

    const requiredIndexes = ["^GSPC", "^GDAXI", "^NDX", "^DJI"];

    const data = await fetch(FMP_URLS["indexQuotes"], {
      next: { revalidate: 30 },
    }).then((res) => res.json());

    const results = data.filter((result: any) =>
      requiredIndexes.includes(result.symbol)
    ) as Quote[] | undefined;

    if (allFields) {
      return results;
    }

    return results?.map((res) => {
      return {
        symbol: res.symbol,
        name: res.name,
        price: res.price,
        changesPercentage: res.changesPercentage,
      };
    });
  } catch {
    return undefined;
  }
}

export async function getQuote(
  symbol: string | undefined,
  allFields?: boolean
): Promise<Quote | undefined> {
  try {
    if (FMP.simulation) {
      return quote;
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
  } catch {
    return undefined;
  }
}

export async function getQuotes(
  symbols: string[] | undefined,
  allFields?: boolean
): Promise<Quote[] | undefined> {
  try {
    if (FMP.simulation) {
      return [quote, quote, quote, quote, quote];
    }

    if (!symbols) {
      return undefined;
    }

    const url = `${FMP_API_URL}v3/quote/${symbols.join(",")}?apikey=${
      env.FMP_API_KEY
    }`;

    const result = (await fetch(url, {
      next: { revalidate: 30 },
    }).then((res) => res.json())) as Quote[] | undefined;

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
  } catch (err) {
    return undefined;
  }
}

export async function getAfterHoursQuote(
  symbol: string | undefined
): Promise<AfterHoursQuote | undefined> {
  try {
    if (FMP.simulation) {
      return quote;
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
  } catch {
    return undefined;
  }
}

export async function getStockQuotes(
  stocks: Pick<Stock, "symbol">[]
): Promise<StockQuote[]> {
  const quotes = await getQuotes(stocks.map((stock) => stock.symbol));

  const results = stocks.map((stock) => ({
    ...stock,
    ...quotes?.find((q) => q.symbol === stock.symbol),
  }));

  return results;
}

export async function getSymbols(
  symbolSet: "All" | "US500",
  pullTimes = 1
): Promise<string[] | undefined> {
  try {
    if (FMP.simulation) {
      return ["AAPL", "MSFT", "GOOG", "TSLA", "NVDA", "META"];
    }

    const url = FMP_URLS[symbolSet];
    const data = await fetch(url, { cache: "no-cache" }).then((res) =>
      res.json()
    );

    return data
      .filter(
        (stock: any) =>
          (stock.type === "stock" || symbolSet === "US500") &&
          !stock.symbol.includes(".") &&
          !stock.symbol.includes("-")
      )
      .map((stock: any) => stock.symbol)
      .slice(0, Number(FMP.docsPerPull) * pullTimes);
  } catch {
    return undefined;
  }
}
