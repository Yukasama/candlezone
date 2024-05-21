'use server'

import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { ScreenerProps, ScreenerSchema } from '../../lib/validators/stock'
import { buildFilter } from '@/utils/screener/build-filter'

/**
 * Query stocks based on screener criteria.
 * @param values `ScreenerSchema` validator
 * @returns Success or error JSON object
 */
export const queryStocks = async (values: ScreenerProps) => {
  const validatedFields = ScreenerSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug('queryStocks (invalid_fields): values=%o', values)
    return []
  }

  const { cursor = 1, take = 10 } = validatedFields.data

  const filter = buildFilter(validatedFields.data)
  const paginationSkip = (cursor - 1) * take

  const data = await db.stock.findMany({
    select: {
      id: true,
      symbol: true,
      image: true,
      companyName: true,
      sector: true,
      country: true,
      peRatioTTM: true,
      mktCap: true,
    },
    where: filter,
    take: take,
    skip: paginationSkip,
    orderBy: { symbol: 'asc' },
  })

  logger.debug('queryStocks (done): results=%s, cursor=%s', data.length, cursor)
  return data
}
