import { appConfig } from '@/config/app';
import { fmpClient } from '@/lib/axios';
import { QUOTE_SIMULATION as QUOTE } from '@/lib/fmp/simulation';
import { Quote } from '@/lib/fmp/types/quote';
import { logger } from '@/lib/logger';
import { isSymbolValid } from '@/lib/utils/stock-helper';

interface QuoteProps {
  symbol: string;
  all?: boolean;
  retries?: 1 | 2 | 3;
}

export const getQuote = async ({ symbol, all, retries = 1 }: QuoteProps) => {
  if (appConfig.fmp.simulation) {
    return QUOTE;
  }

  try {
    if (!isSymbolValid(symbol)) {
      return;
    }

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const { data } = await fmpClient.get<Quote[]>(`v3/quote/${symbol}`, {
          next: { revalidate: 2 },
        });
        const quote = data[0];

        if (all) {
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
  } catch (error) {
    if (error instanceof Error) {
      logger.error('getQuote (error): %s', error.message);
    }
  }
};

interface QuotesProps {
  symbols: string[];
  all?: boolean;
}

export const getQuotes = async ({ symbols, all }: QuotesProps) => {
  if (appConfig.fmp.simulation) {
    return [QUOTE, QUOTE, QUOTE, QUOTE, QUOTE];
  }

  if (!symbols) {
    return;
  }

  try {
    const joined = symbols.join(',');
    const { data } = await fmpClient.get<Quote[]>(`v3/quote/${joined}`, {
      next: { revalidate: 2 },
    });

    if (all) {
      return data;
    }

    return data?.map(({ symbol, name, price, changesPercentage, pe, eps }) => {
      return { symbol, name, price, changesPercentage, pe, eps };
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error('getQuotes (error): %s', error.message);
    }
  }
};
