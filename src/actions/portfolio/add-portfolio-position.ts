'use server'

import { getUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { getStockQuotes } from '@/lib/fmp/quote/quote'
import { logger } from '@/lib/logger'
import {
  AddPortfolioPositionProps,
  AddPortfolioPositionSchema,
} from '@/lib/validators/portfolio'
import { revalidatePath } from 'next/cache'

/**
 * Add positions to a portfolio.
 * @param values `AddPortfolioPositionSchema` validator
 * @returns Success or error JSON object
 */
export const addPortfolioPosition = async (
  values: AddPortfolioPositionProps,
) => {
  const validatedFields = AddPortfolioPositionSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug('addPortfolioPosition (invalid_data): values=%o', values)
    return { error: 'Invalid data.' }
  }

  const { portfolioId, positions } = validatedFields.data

  const user = await getUser()
  if (!user) {
    logger.debug(
      'addPortfolioPosition (unauthorized): portfolioId=%s',
      portfolioId,
    )
    return { error: 'Unauthorized.' }
  }

  const [portfolio, stocksToAdd] = await Promise.all([
    db.portfolio.findFirst({
      select: {
        id: true,
        positions: {
          select: { stockId: true },
        },
      },
      where: {
        id: portfolioId,
        userId: user.id,
      },
    }),
    db.stock.findMany({
      select: {
        id: true,
        symbol: true,
        companyName: true,
      },
      where: {
        id: { in: positions.map((p) => p.stockId) },
      },
    }),
  ])

  const quotes = await getStockQuotes(stocksToAdd)

  if (!portfolio) {
    logger.debug(
      'addPortfolioPosition (not-found): portfolioId=%s',
      portfolioId,
    )
    return { error: 'Portfolio not found.' }
  }

  const existingAndNewStockIds = await db.stock.findMany({
    where: {
      id: { in: positions.map((p) => p.stockId) },
      NOT: {
        portfolios: {
          some: { portfolioId: portfolioId },
        },
      },
    },
    select: { id: true },
  })

  const validStockIds = new Set(existingAndNewStockIds.map((stock) => stock.id))
  const validPositions = positions.filter((p) => validStockIds.has(p.stockId))

  if (validPositions.length > 0) {
    await db.portfolioPosition.createMany({
      data: validPositions.map((p) => ({
        portfolioId: portfolioId,
        stockId: p.stockId,
        quantity: p.quantity ?? 1,
        price:
          p.price !== 0
            ? quotes?.find((q) => q.id === p.stockId)?.price ?? 1
            : 1,
      })),
    })
  }

  revalidatePath(`/p/${portfolioId}`)

  logger.debug(
    'addPortfolioPosition (done): portfolioId=%s, positions=%o',
    portfolioId,
    validStockIds,
  )

  return { success: 'Positions added successfully.' }
}
