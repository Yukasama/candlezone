'use server'

import { logger } from '@/lib/logger'
import { HistoryProps, HistorySchema } from '../../lib/validators/stock'
import { fetchHistory } from '@/lib/fmp/history/fetch-history'

/**
 * Get timeframe-specific history data of a stock.
 * @param values `HistorySchema` validator
 * @returns History data or error JSON object
 */
export const getHistory = async (values: HistoryProps) => {
  const validatedFields = HistorySchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug('getHistory (invalid_fields): values=%o', values)
    return []
  }

  const { symbol, timeframe, allFields } = validatedFields.data

  const data = await fetchHistory({ symbol, timeframe, allFields })

  logger.debug('getHistory (done): symbol=%s, timeframe=%s', symbol, timeframe)
  return data
}
