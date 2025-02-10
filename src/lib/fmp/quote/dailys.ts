import { appConfig } from '@/config/app';
import { fmpClient } from '@/lib/axios';
import { QUOTE_SIMULATION as QUOTE } from '@/lib/fmp/simulation';
import { Quote } from '@/lib/fmp/types/quote';
import { logger } from '@/lib/logger';
import { isSymbolValid } from '@/lib/utils/stock-helper';

export const getDailys = async (action: 'actives' | 'losers' | 'winners') => {
  if (appConfig.fmp.simulation) {
    return [QUOTE, QUOTE, QUOTE, QUOTE, QUOTE];
  }

  try {
    const { data } = await fmpClient.get<Quote[]>(`v3/stock_market/${action}`, {
      cache: 'force-cache',
    });

    return data.filter(({ symbol }) => isSymbolValid(symbol)).slice(0, 6);
  } catch (error) {
    if (error instanceof Error) {
      logger.debug('getDailys (error): %s', error.message);
    }
  }
};
