import { fmpClient } from '@/lib/axios';
import { logger } from '@/lib/logger';
import { isSymbolValid } from '@/lib/utils/stock-helper';
import { InsiderTrade } from '../types/insider';

export const getStockInsiders = async ({ symbol }: { symbol: string }) => {
  try {
    if (isSymbolValid(symbol)) {
      return [];
    }

    const { data } = await fmpClient.get<InsiderTrade[]>(
      `v4/insider-roaster-statistic?symbol=${symbol}`,
    );

    return data;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('getStockInsiders (error): %s', error.message);
    }
    return [];
  }
};
