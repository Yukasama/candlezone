import { appConfig } from '@/config/app';
import { env } from '@/env.mjs';
import { db } from '@/lib/db';
import { AfterHoursQuote, Quote } from '@/types/stock';
import {
  AFTER_HOURS_QUOTE_SIMULATION,
  QUOTE_SIMULATION,
} from '@/utils/simulation';
import { isSymbolValid } from '@/utils/stock-helper';
import { Stock } from '@prisma/client';
import 'server-only';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const config = appConfig.fmp;

export const getQuote = async ({
  symbol,
  allFields,
  retries = 1,
}: {
  symbol?: string;
  allFields?: boolean;
  retries?: 1 | 2 | 3;
}) => {
  if (config.simulation) {
    return QUOTE_SIMULATION;
  }

  if (!isSymbolValid(symbol)) {
    return;
  }

  const url = `${config.url}v3/quote/${symbol}?apikey=${env.FMP_API_KEY}`;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const data = await fetch(url, { next: { revalidate: 2 } }).then(
        (res) => res.json() as Promise<Quote[]>,
      );

      const quote = data[0];
      if (allFields) {
        return quote;
      }

      return {
        symbol: quote.symbol,
        name: quote.name,
        price: quote.price,
        changesPercentage: quote.changesPercentage,
        pe: quote.pe,
        eps: quote.eps,
      };
    } catch {
      if (attempt === retries - 1) {
        return;
      }
    }
  }
};

export const getQuotes = async (symbols: string[], allFields?: boolean) => {
  if (config.simulation) {
    return [
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
    ];
  }

  if (!symbols) {
    return;
  }

  const url = `${config.url}v3/quote/${symbols.join(',')}?apikey=${
    env.FMP_API_KEY
  }`;

  try {
    const data = await fetch(url, { next: { revalidate: 5 } }).then(
      (res) => res.json() as Promise<Quote[]>,
    );

    if (allFields) {
      return data;
    }

    return data?.map((d) => {
      return {
        symbol: d.symbol,
        name: d.name,
        price: d.price,
        changesPercentage: d.changesPercentage,
        pe: d.pe,
        eps: d.eps,
      };
    });
  } catch {
    return;
  }
};

export const getAfterHoursQuote = async (symbol: string) => {
  if (config.simulation) {
    return AFTER_HOURS_QUOTE_SIMULATION;
  }

  const url = `${config.url}v4/pre-post-market-trade/${symbol}?apikey=${env.FMP_API_KEY}`;

  try {
    const data = await fetch(url, {
      next: { revalidate: 30 },
    }).then((res) => res.json() as Promise<AfterHoursQuote>);

    return {
      symbol: data.symbol,
      price: data.price,
    };
  } catch {
    return;
  }
};

type RequiredStockFields = Pick<Stock, 'id' | 'symbol' | 'companyName'>;

type StockWithAdditionalFields = RequiredStockFields &
  Partial<Omit<Stock, keyof RequiredStockFields>>;

export const getStockQuotes = async (stocks: StockWithAdditionalFields[]) => {
  const quotes = await getQuotes(stocks.map((stock) => stock.symbol));

  return stocks.map((stock) => ({
    ...stock,
    ...(quotes?.find((q) => q.symbol === stock.symbol) as Quote | undefined),
  }));
};

export type ActivityQuote = Awaited<ReturnType<typeof findStockForActivity>>[0];

export const findStockForActivity = async (activity: Quote[]) => {
  const stocks = await db.stock.findMany({
    select: {
      id: true,
      symbol: true,
      companyName: true,
      image: true,
    },
    where: {
      symbol: { in: activity.map((stock) => stock.symbol) },
      isEtf: false,
      isFund: false,
      companyName: { not: undefined },
    },
  });

  return stocks
    .map((stock) => {
      const quote = activity.find((q) => q.symbol === stock.symbol);
      return { ...stock, ...quote };
    })
    .slice(0, stocks.length < 3 ? stocks.length : 3);
};
