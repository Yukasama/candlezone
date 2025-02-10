'use server';

import { HistoryProps, HistorySchema } from '@/features/stock/lib/validators';
import { fetchHistory } from '@/lib/fmp/history/fetch-history';
import { logger } from '@/lib/logger';

/**
 * Get timeframe-specific history data of a stock.
 * @param values `HistorySchema` validator
 * @returns History data or error JSON object
 */
export const getHistory = async (values: HistoryProps) => {
  const { data, error, success } = HistorySchema.safeParse(values);
  if (!success) {
    logger.debug(
      'getHistory (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return;
  }

  const { all, symbol, timeframe } = data;

  const history = await fetchHistory({ all, symbol, timeframe });
  logger.debug(
    'getHistory (done): symbol=%s, length=%s, timeframe=%s',
    symbol,
    history?.length,
    timeframe,
  );
  return history;
};
