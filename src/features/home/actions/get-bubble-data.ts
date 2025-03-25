import { siteConfig } from '@/config/site';
import { getStockQuotes } from '@/features/stock/lib/get-stock-quotes';
import { StockQuote } from '@/features/stock/types/stock';
import { db } from '@/lib/db';
import { getQuotes } from '@/lib/fmp/quote/get-quotes';

export type BubbleStock = StockQuote & {
  type: 'commodity' | 'crypto' | 'index' | 'stock';
};

const cryptoSymbols = ['BTCUSD', 'ETHUSD', 'XRPUSD'];

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

export const getBubbleData = async () => {
  const stocks = await db.stock.findMany({
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
    take: 60,
    where: {
      isEtf: false,
      symbol: {
        not: { contains: '.', in: ['AXTLF', 'GOOGL', 'RQHTF', 'COCXF'] },
      },
    },
  });

  const stockQuotes = await getStockQuotes(stocks);

  const additionalSymbols = [
    ...Object.keys(commodityMap),
    ...cryptoSymbols,
    // ...Object.keys(indexCountryMap),
  ];

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

      if (Object.keys(commodityMap).includes(quote.symbol)) {
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
        Object.keys(indexCountryMap).includes(quote.symbol) ||
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

    return [...data, ...additionalData];
  }

  return data;
};
