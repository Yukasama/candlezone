'use server'

import { getUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import {
  DeletePortfolioProps,
  DeletePortfolioSchema,
} from '@/lib/validators/portfolio'
import { revalidatePath } from 'next/cache'

/**
 * Delete a portfolio.
 * @param values `DeletePortfolioSchema` validator
 * @returns Success or error JSON object
 */
export const deletePortfolio = async (values: DeletePortfolioProps) => {
  const validatedFields = DeletePortfolioSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug('deletePortfolio (invalid_data): values=%o', values)
    return { error: 'Invalid data.' }
  }

  const { portfolioId } = validatedFields.data

  const user = await getUser()
  if (!user) {
    logger.debug('deletePortfolio (unauthorized): portfolioId=%s', portfolioId)
    return { error: 'Unauthorized.' }
  }

  const portfolio = await db.portfolio.delete({
    where: {
      id: portfolioId,
      userId: user.id,
    },
  })

  if (!portfolio) {
    logger.debug(
      'deletePortfolio (not_found): portfolioId=%s, userId=%s',
      portfolioId,
      user.id
    )
    return { error: 'Portfolio could not be deleted.' }
  }

  revalidatePath('/portfolio')

  logger.debug('deletePortfolio (done): portfolioId=%s', portfolioId)

  return { success: 'Portfolio deleted successfully.' }
}
