'use server'

import { getUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import {
  RemovePortfolioPositionProps,
  RemovePortfolioPositionSchema,
} from '@/lib/validators/portfolio'
import { revalidatePath } from 'next/cache'
// import { revalidatePath } from 'next/cache'

/**
 * Remove positions from a portfolio.
 * @param values `RemovePortfolioPositionSchema` validator
 * @returns Success or error JSON object
 */
export const removePortfolioPosition = async (
  values: RemovePortfolioPositionProps,
  revalidate = true,
) => {
  const validatedFields = RemovePortfolioPositionSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug('removePortfolioPosition (invalid_data): values=%o', values)
    return { error: 'Invalid data.' }
  }

  const { portfolioId, positions } = validatedFields.data

  const user = await getUser()
  if (!user) {
    logger.debug(
      'removePortfolioPosition (unauthorized): portfolioId=%s',
      portfolioId,
    )
    return { error: 'Unauthorized.' }
  }

  await db.stockInPortfolio.deleteMany({
    where: {
      portfolioId: portfolioId,
      portfolio: {
        userId: user.id,
      },
      stockId: { in: positions.map((p) => p.stockId) },
    },
  })

  if (revalidate) {
    revalidatePath(`/p/${portfolioId}`)
  }

  logger.debug(
    'removePortfolioPosition (done): portfolioId=%s, positions=%o',
    portfolioId,
    positions,
  )

  return { success: 'Positions removed successfully.' }
}
