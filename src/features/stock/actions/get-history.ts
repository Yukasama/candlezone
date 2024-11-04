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
  const { data, success, error } = HistorySchema.safeParse(values);
  if (!success) {
    logger.debug(
      'getHistory (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return;
  }

  const { symbol, timeframe, all } = data;

  const history = await fetchHistory({ symbol, timeframe, all });
  logger.debug('getHistory (done): symbol=%s, timeframe=%s', symbol, timeframe);
  return history;
};
