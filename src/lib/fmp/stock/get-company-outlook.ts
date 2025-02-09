import { fmpClient } from '@/lib/axios';
import { logger } from '@/lib/logger';
import { StockData } from '../types/stock';

export const getCompanyOutlook = async ({ symbol }: { symbol: string }) => {
  try {
    const { data } = await fmpClient.get<StockData>(
      `v4/company-outlook?symbol=${symbol}`,
      { next: { revalidate: 3600 } },
    );

    return { ...data, ratios: data.ratios[0] };
  } catch (error) {
    if (error instanceof Error) {
      logger.debug('getCompanyOutlook (error): %s', error.message);
    }
  }
};
