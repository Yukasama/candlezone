import { appConfig } from '@/config/app';
import { fmpClient } from '@/lib/axios';
import { logger } from '@/lib/logger';
import { AFTER_HOURS_QUOTE_SIMULATION } from '../simulation';
import { AfterHoursQuote } from '../types/quote';

export const getAfterHoursQuote = async ({ symbol }: { symbol: string }) => {
  if (appConfig.fmp.simulation) {
    return AFTER_HOURS_QUOTE_SIMULATION;
  }

  try {
    const { data } = await fmpClient.get<AfterHoursQuote>(
      `v4/pre-post-market-trade/${symbol}`,
      { next: { revalidate: 10 } },
    );

    return data;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('getAfterHoursQuote (error): %s', error.message);
    }
  }
};
