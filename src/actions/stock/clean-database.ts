'use server'

import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

/**
 * Clean database by deleting stocks with error messages.
 * @returns Deleted count of stocks with error messages.
 */
export const cleanDatabase = async () => {
  const deleted = await db.stock.deleteMany({
    where: { errorMessage: { not: null } },
  })

  logger.info('cleanDatabase (done): deleteCount=%s', deleted.count)

  return deleted
}
