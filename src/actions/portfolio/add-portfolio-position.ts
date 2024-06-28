'use server'

import { getUser } from '@/lib/auth'
import { db } from '@/lib/db'
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
  values: AddPortfolioPositionProps
) => {
  const validatedFields = AddPortfolioPositionSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug('addPortfolioPosition (invalid_fields): values=%o', values)
    return { error: 'Invalid fields.' }
  }

  const { portfolioId, positions } = validatedFields.data

  const user = await getUser()
  if (!user) {
    logger.debug(
      'addPortfolioPosition (unauthorized): portfolioId=%s',
      portfolioId
    )
    return { error: 'Unauthorized.' }
  }

  const portfolio = await db.portfolio.findFirst({
    select: {
      id: true,
      stocks: {
        select: { stockId: true },
      },
    },
    where: {
      id: portfolioId,
      userId: user.id,
    },
  })

  if (!portfolio) {
    logger.debug(
      'addPortfolioPosition (not-found): portfolioId=%s',
      portfolioId
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
    await db.stockInPortfolio.createMany({
      data: validPositions.map((p) => ({
        portfolioId: portfolioId,
        stockId: p.stockId,
        quantity: p.quantity ?? 1,
        price: p.price,
      })),
    })
  }

  revalidatePath(`/p/${portfolioId}`)

  logger.debug(
    'addPortfolioPosition (done): portfolioId=%s, positions=%o',
    portfolioId,
    validStockIds
  )

  return { success: 'Positions added successfully.' }
}
