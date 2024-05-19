'use server'

import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

/**
 * Clear database by deleting all stock entries.
 * @returns Deleted count of all stocks.
 */
export const clearStocks = async () => {
  const deleted = await db.stock.deleteMany()

  logger.info('clearStocks (done): deleteCount=%s', deleted.count)
  return deleted
}
