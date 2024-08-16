'use server'

import { getUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { UpdateOrderProps, UpdateOrderSchema } from '@/lib/validators/portfolio'
import { validateOrder } from '@/utils/order/validate-order'
import { revalidatePath } from 'next/cache'

/**
 * Update an order from a portfolio.
 * @param values `UpdateOrderSchema` validator
 * @returns Success or error JSON object
 */
export const updateOrder = async (values: UpdateOrderProps) => {
  const validatedFields = UpdateOrderSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug('updateOrder (invalid_data): values=%o', values)
    return { error: 'Invalid data.' }
  }

  const { order } = validatedFields.data

  const user = await getUser()
  if (!user) {
    logger.debug('updateOrder (unauthorized): order=%o', order)
    return { error: 'Unauthorized.' }
  }

  const orderToUpdate = await db.portfolioOrder.findFirst({
    where: {
      id: order.id,
      portfolio: {
        userId: user.id,
      },
    },
  })

  if (!orderToUpdate) {
    logger.debug(
      'updateOrder (not_found): orderId=%s userId=%s',
      order.id,
      user.id,
    )
    return { error: 'Order not found.' }
  }

  try {
    const portfolioWithOrders = await db.portfolio.findFirst({
      include: {
        orders: true,
      },
      where: {
        id: orderToUpdate.portfolioId,
        orders: {
          some: {
            stockId: orderToUpdate.stockId,
          },
        },
      },
    })

    if (!portfolioWithOrders) {
      logger.debug(
        'updateOrder (not_found): id=%s portfolioId=%s',
        orderToUpdate.id,
        orderToUpdate.portfolioId,
      )
      return { error: 'Portfolio not found.' }
    }

    validateOrder(portfolioWithOrders, orderToUpdate)
    db.portfolioOrder.update({
      data: order,
      where: {
        id: order.id,
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      logger.error('updateOrder (error): error=%s', error.message)
    }
    return { error: 'Error updating order.' }
  }

  revalidatePath(`/p/${orderToUpdate.portfolioId}`)
  logger.debug('updateOrder (done): order=%o', orderToUpdate)
  return { success: true }
}
