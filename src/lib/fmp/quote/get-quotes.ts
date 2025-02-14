import { appConfig } from '@/config/app';
import { fmpClient } from '@/lib/axios';
import { QUOTE_SIMULATION as QUOTE } from '@/lib/fmp/simulation';
import { Quote } from '@/lib/fmp/types/quote';
import { logger } from '@/lib/logger';

interface QuotesProps {
  all?: boolean;
  symbols: string[];
}

export const getQuotes = async ({ all, symbols }: QuotesProps) => {
  if (appConfig.fmp.simulation) {
    return [QUOTE, QUOTE, QUOTE, QUOTE, QUOTE];
  }

  if (symbols.length === 0) {
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

    return data.map(({ changesPercentage, eps, name, pe, price, symbol }) => {
      return { changesPercentage, eps, name, pe, price, symbol };
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.debug('getQuotes (error): %s', error.message);
    }
  }
};
