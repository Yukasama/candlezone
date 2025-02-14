'use server';

import { appConfig } from '@/config/app';
import { fmpClient } from '@/lib/axios';
import { QUOTE_SIMULATION as QUOTE } from '@/lib/fmp/simulation';
import { Quote } from '@/lib/fmp/types/quote';
import { logger } from '@/lib/logger';
import { isSymbolValid } from '@/lib/utils/stock-helper';

interface QuoteProps {
  all?: boolean;
  retries?: 1 | 2 | 3;
  symbol: string;
}

export const getQuote = async ({ all, retries = 1, symbol }: QuoteProps) => {
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

        if (!Array.isArray(data) || data.length === 0) {
          return;
        }

        const quote = data[0];
        if (all) {
          return quote;
        }

        return {
          changesPercentage: quote.changesPercentage,
          eps: quote.eps,
          name: quote.name,
          pe: quote.pe,
          price: quote.price,
          symbol: quote.symbol,
        };
      } catch {
        if (attempt === retries - 1) {
          return;
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.debug('getQuote (error): %s', error.message);
    }
  }
};
