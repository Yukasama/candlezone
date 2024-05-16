'use server'

import { getUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import {
  CreatePortfolioProps,
  CreatePortfolioSchema,
} from '@/lib/validators/portfolio'
import { getRandomColor } from '@/utils/utils'
import { revalidatePath } from 'next/cache'

/**
 * Create a portfolio.
 * @param values `CreatePortfolioSchema` validator
 * @returns Success or error JSON object
 */
export const createPortfolio = async (values: CreatePortfolioProps) => {
  const validatedFields = CreatePortfolioSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug('createPortfolio (invalid_fields): values=%o', values)
    return { error: 'Invalid fields.' }
  }

  const { title, isPublic } = validatedFields.data

  const user = await getUser()
  if (!user) {
    logger.debug('createPortfolio (unauthorized): title=%s', title)
    return { error: 'Unauthorized.' }
  }

  const portfolio = await db.portfolio.create({
    data: {
      title,
      isPublic: !!isPublic,
      userId: user.id,
      color: getRandomColor(),
    },
  })

  revalidatePath('/portfolio')

  logger.debug('createPortfolio: portfolioId=%s', portfolio.id)
  return { success: 'Portfolio created successfully.' }
}
