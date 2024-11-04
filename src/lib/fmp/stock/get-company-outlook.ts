import { fmpClient } from '@/lib/axios';
import { logger } from '@/lib/logger';
import { ListedSymbol } from '../types/info';

export const getCompanyOutlook = async ({ symbol }: { symbol: string }) => {
  try {
    const { data } = await fmpClient.get<ListedSymbol[]>(
      `v4/company-outlook?symbol=${symbol}`,
    );

    return data;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('getCompanyOutlook (error): %s', error.message);
    }
  }
};
