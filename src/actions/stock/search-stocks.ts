'use server'

import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { SearchProps, SearchSchema } from '@/lib/validators/stock'

/**
 * Search stocks based on search term.
 * @param values `SearchSchema` validator
 * @returns Success or error JSON object
 */
export const searchStocks = async (values: SearchProps) => {
  const validatedFields = SearchSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug('searchStocks (invalid_data): values=%o', values)
    return []
  }

  const { input } = validatedFields.data

  const data = await db.stock.findMany({
    select: {
      id: true,
      symbol: true,
      image: true,
      companyName: true,
      isEtf: true,
    },
    where: {
      OR: [
        { symbol: { startsWith: input, mode: 'insensitive' } },
        { companyName: { startsWith: input, mode: 'insensitive' } },
      ],
    },
    take: 10,
  })

  logger.debug('searchStocks (done): search=%s, results=%s', input, data.length)

  return data
}
