import { DailyHistory, MultipleDailyHistory } from '../types/history';

export const isMultipleDailyHistory = (
  data: unknown,
): data is MultipleDailyHistory => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'historicalStockList' in data &&
    Array.isArray((data as MultipleDailyHistory).historicalStockList)
  );
};

export const isDailyHistory = (data: unknown): data is DailyHistory => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'symbol' in data &&
    'historical' in data &&
    Array.isArray((data as DailyHistory).historical)
  );
};
