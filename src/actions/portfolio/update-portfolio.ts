'use server'

import { getUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import {
  UpdatePortfolioProps,
  UpdatePortfolioSchema,
} from '@/lib/validators/portfolio'
import { revalidatePath } from 'next/cache'

/**
 * Update portfolio information.
 * @param values `UpdatePortfolioSchema` validator
 * @returns Success or error JSON object
 */
export const updatePortfolio = async (values: UpdatePortfolioProps) => {
  const validatedFields = UpdatePortfolioSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug(
      'updatePortfolio (invalid_data): values=%o, issues=%o',
      values,
      validatedFields.error.issues,
    )
    return { error: 'Invalid data.' }
  }

  const { portfolioId, title, isPublic, color } = validatedFields.data

  const user = await getUser()
  if (!user) {
    logger.debug('updatePortfolio (unauthorized): portfolioId=%s', portfolioId)
    return { error: 'Unauthorized.' }
  }

  await db.portfolio.update({
    data: {
      ...(title && { title }),
      ...(isPublic !== undefined && { isPublic: !!isPublic }),
      ...(color && { color }),
    },
    where: {
      id: portfolioId,
      userId: user?.id,
    },
  })

  revalidatePath(`/p/${portfolioId}`)

  logger.debug(
    'updatePortfolio (done): portfolioId=%s, title=%s isPublic=%s',
    portfolioId,
    title,
    isPublic,
  )

  return { success: 'Portfolio updated successfully.' }
}
