'use server'

import { getUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import {
  CreatePortfolioProps,
  CreatePortfolioSchema,
} from '@/lib/validators/portfolio'
import { getRandomColor } from '@/utils/generators/generate-colors'
import { addOrders } from './order/add-orders'

/**
 * Create a portfolio.
 * @param values `CreatePortfolioSchema` validator
 * @returns Success or error JSON object
 */
export const createPortfolio = async (values: CreatePortfolioProps) => {
  const validatedFields = CreatePortfolioSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug(
      'createPortfolio (invalid_data): values=%o, issues=%o',
      values,
      validatedFields.error.issues,
    )
    return { error: 'Invalid data.' }
  }

  const { title, isPublic, orders } = validatedFields.data

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

  if (orders?.length) {
    addOrders({ portfolioId: portfolio.id, orders })
  }

  logger.debug(
    'createPortfolio (done): portfolioId=%s, title=%s, isPublic=%s orders=%o',
    portfolio.id,
    title,
    isPublic,
    orders,
  )

  return { portfolioId: portfolio.id }
}
