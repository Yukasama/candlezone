import { appConfig } from '@/config/app';
import { fmpClient } from '@/lib/axios';
import { logger } from '@/lib/logger';
import { isSymbolValid } from '@/lib/utils/stock-helper';
import { ListedSymbol } from '../types/info';

export const getSymbols = async () => {
  if (appConfig.fmp.simulation) {
    return ['AAPL', 'MSFT', 'GOOG', 'TSLA', 'NVDA', 'META'];
  }

  try {
    const { data } = await fmpClient.get<ListedSymbol[]>('v3/stock/list');

    return data
      .filter(
        (stock) =>
          isSymbolValid(stock.symbol) &&
          !!stock.name &&
          !!stock.price &&
          stock.type !== 'trust',
      )
      .map((stock) => stock.symbol);
  } catch (error) {
    if (error instanceof Error) {
      logger.error('getSymbols (error): %s', error.message);
    }
  }
};
