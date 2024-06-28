'use server'

import { getUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { calcPortfolioHistory } from '@/lib/fmp/history/calc-portfolio-history'
import { logger } from '@/lib/logger'
import {
  PortfolioHistoryProps,
  PortfolioHistorySchema,
} from '@/lib/validators/portfolio'

/**
 * Get the portfolio's merged chart history.
 * @param values `PortfolioHistorySchema` validator
 * @returns Success or error JSON object
 */
export const getPortfolioHistory = async (values: PortfolioHistoryProps) => {
  const validatedFields = PortfolioHistorySchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug('getPortfolioHistory (invalid_fields): values=%o', values)
    return
  }

  const { portfolioId, timeframe } = validatedFields.data

  const portfolio = await db.portfolio.findFirst({
    select: {
      isPublic: true,
      userId: true,
    },
    where: { id: portfolioId },
  })

  if (!portfolio) {
    logger.debug('getPortfolioHistory (not_found): portfolioId=%s', portfolioId)
    return
  }

  if (portfolio.isPublic) {
    logger.debug('getPortfolioHistory (done): portfolioId=%s', portfolioId)
    return await calcPortfolioHistory(portfolioId, timeframe)
  }

  const user = await getUser()
  if (user?.id !== portfolio.userId) {
    logger.debug(
      'getPortfolioHistory (forbidden): portfolioId=%s, userId=%s',
      portfolioId,
      user?.id
    )
    return
  }

  logger.debug('getPortfolioHistory (done): portfolioId=%s', portfolioId)

  return await calcPortfolioHistory(portfolioId, timeframe)
}
