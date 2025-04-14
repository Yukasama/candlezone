import { siteConfig } from '@/config/site';
import {
  getStockQuotes,
  StockWithAdditionalFields,
} from '@/features/stock/lib/get-stock-quotes';
import { StockQuote } from '@/features/stock/types/stock';
import { db } from '@/lib/db';
import { getQuotes } from '@/lib/fmp/quote/get-quotes';
import { unstable_cacheLife as cacheLife } from 'next/cache';

export type BubbleStock = StockQuote & {
  type: 'commodity' | 'crypto' | 'index' | 'stock';
};

const cryptoSymbols = ['BTCUSD', 'ETHUSD', 'XRPUSD', 'SOLUSD', 'ADAUSD'];

const commodityMap: Record<
  string,
  { amount: number; image: string; name: string }
> = {
  GCUSD: {
    amount: 6716605000,
    image: `${siteConfig.url}/gold.webp`,
    name: 'Gold',
  },
  PAUSD: {
    amount: 175083000,
    image: `${siteConfig.url}/palladium.webp`,
    name: 'Palladium',
  },
  PLUSD: {
    amount: 250103000,
    image: `${siteConfig.url}/platinum.webp`,
    name: 'Platinum',
  },
  SIUSD: {
    amount: 56277900000,
    image: `${siteConfig.url}/silver.webp`,
    name: 'Silver',
  },
};

const countryUrl =
  'https://purecatamphetamine.github.io/country-flag-icons/3x2/';
const indexCountryMap: Record<string, string> = {
  '^DJI': `${countryUrl}US.svg`,
  '^GSPC': `${countryUrl}US.svg`,
  '^IXIC': `${countryUrl}US.svg`,
};

// Check if current time is before 15:30 German time
const isBeforeUSMarketOpen = (): boolean => {
  const now = new Date();
  const germanTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }),
  );
  return (
    germanTime.getHours() < 15 ||
    (germanTime.getHours() === 15 && germanTime.getMinutes() < 30)
  );
};

interface StockPair {
  de: StockWithAdditionalFields;
  us: StockWithAdditionalFields;
}

export const getBubbleData = async (): Promise<BubbleStock[]> => {
  'use cache';
  cacheLife({
    expire: 1,
    revalidate: 0.5,
    stale: 0.9,
  });

  const shouldUseGermanPrices = isBeforeUSMarketOpen();

  const allStocks = await db.stock.findMany({
    orderBy: { marketCap: 'desc' },
    select: {
      companyName: true,
      country: true,
      earningsDate: true,
      id: true,
      image: true,
      marketCap: true,
      netProfitMarginTTM: true,
      priceToEarningsRatioTTM: true,
      sector: true,
      symbol: true,
    },
    take: 700,
    where: {
      isEtf: false,
      isFund: false,
      symbol: {
        not: {
          in: [
            'AXTLF',
            'GOOGL',
            'RQHTF',
            'COCXF',
            'TWTR',
            'QUCCF',
            'FLRAP',
            'SLEGF',
          ],
        },
      },
    },
  });

  const stocksByCompany = new Map<string, StockWithAdditionalFields[]>();

  for (const stock of allStocks) {
    const normalizedName = stock.companyName.toLowerCase().trim();
    if (!stocksByCompany.has(normalizedName)) {
      stocksByCompany.set(normalizedName, []);
    }
    stocksByCompany.get(normalizedName)?.push(stock);
  }

  const dedupedStocks: StockWithAdditionalFields[] = [];
  const usStocksWithGermanEquivalents: StockPair[] = [];

  for (const companyStocks of stocksByCompany.values()) {
    if (companyStocks.length === 1) {
      dedupedStocks.push(companyStocks[0]);
    } else {
      const usStock = companyStocks.find(
        (s) => s.country === 'US' && !s.symbol.toLowerCase().endsWith('.de'),
      );
      const germanStock = companyStocks.find((s) =>
        s.symbol.toLowerCase().endsWith('.de'),
      );

      if (usStock && germanStock && shouldUseGermanPrices) {
        usStocksWithGermanEquivalents.push({ de: germanStock, us: usStock });
        dedupedStocks.push(usStock);
      } else {
        const sortedStocks = [...companyStocks].sort((a, b) => {
          if (a.symbol.length !== b.symbol.length) {
            return a.symbol.length - b.symbol.length;
          }
          return a.symbol.localeCompare(b.symbol);
        });
        dedupedStocks.push(sortedStocks[0]);
      }
    }
  }

  const stocks = dedupedStocks
    .toSorted((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0))
    .slice(0, 500);

  const stockQuotes = await getStockQuotes(stocks);

  if (shouldUseGermanPrices && usStocksWithGermanEquivalents.length > 0) {
    const germanSymbols = usStocksWithGermanEquivalents.map(
      (pair) => pair.de.symbol,
    );

    const germanQuotes = await getQuotes({ symbols: germanSymbols });

    if (germanQuotes) {
      const germanQuotesMap = new Map(
        germanQuotes.map((quote) => [quote.symbol, quote]),
      );

      const usToGermanMap = new Map(
        usStocksWithGermanEquivalents.map((pair) => [
          pair.us.symbol,
          pair.de.symbol,
        ]),
      );

      for (const usQuote of stockQuotes) {
        const germanSymbol = usToGermanMap.get(usQuote.symbol);
        if (germanSymbol) {
          const germanQuote = germanQuotesMap.get(germanSymbol);

          if (germanQuote?.price) {
            usQuote.price = germanQuote.price;
            usQuote.changesPercentage = germanQuote.changesPercentage;
          }
        }
      }
    }
  }

  const additionalSymbols = [...Object.keys(commodityMap), ...cryptoSymbols];
  const quotes = await getQuotes({ symbols: additionalSymbols });

  const data: BubbleStock[] = stockQuotes.map((stock) => ({
    ...stock,
    type: 'stock',
  }));

  const existingSymbols = new Set(data.map((s) => s.symbol));

  if (quotes && quotes.length > 0) {
    const additionalData: BubbleStock[] = [];

    for (const quote of quotes) {
      if (existingSymbols.has(quote.symbol)) {
        continue;
      }

      let type: 'commodity' | 'crypto' | 'index' | 'stock' = 'stock';
      let image = '';
      let name = quote.name || quote.symbol;
      let marketCap = quote.marketCap ?? 0;

      if (quote.symbol in commodityMap) {
        type = 'commodity';
        image = commodityMap[quote.symbol].image;
        name = commodityMap[quote.symbol].name;

        if (quote.price) {
          marketCap = quote.price * commodityMap[quote.symbol].amount;
        }
      } else if (
        cryptoSymbols.includes(quote.symbol) ||
        quote.symbol.endsWith('USD')
      ) {
        type = 'crypto';
        image = `https://images.financialmodelingprep.com/symbol/${quote.symbol}.png`;
        name = quote.name.replace('USD', '');

        marketCap = quote.marketCap ?? 0;
      } else if (
        quote.symbol in indexCountryMap ||
        quote.symbol.startsWith('^')
      ) {
        type = 'index';
        image = indexCountryMap[quote.symbol];
      }

      additionalData.push({
        ...quote,
        companyName: name,
        image,
        marketCap,
        type,
      } as BubbleStock);
    }

    return [...data, ...additionalData].sort(
      (a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0),
    );
  }

  return data;
};
