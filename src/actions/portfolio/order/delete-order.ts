'use server'

import { getUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { DeleteOrderProps, DeleteOrderSchema } from '@/lib/validators/portfolio'
import { validateOrder } from '@/utils/order/validate-order'
import { revalidatePath } from 'next/cache'

/**
 * Delete an order from a portfolio.
 * @param values `DeleteOrderSchema` validator
 * @returns Success or error JSON object
 */
export const deleteOrder = async (values: DeleteOrderProps) => {
  const validatedFields = DeleteOrderSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug(
      'deleteOrder (invalid_data): values=%o, issues=%o',
      values,
      validatedFields.error.issues,
    )
    return { error: 'Invalid data.' }
  }

  const { orderId } = validatedFields.data

  const user = await getUser()
  if (!user) {
    logger.debug('deleteOrder (unauthorized): orderId=%o', orderId)
    return { error: 'Unauthorized.' }
  }

  const orderToDelete = await db.portfolioOrder.findFirst({
    where: {
      id: orderId,
      portfolio: { userId: user.id },
    },
  })

  if (!orderToDelete) {
    logger.debug(
      'deleteOrder (not_found): orderId=%s userId=%s',
      orderId,
      user.id,
    )
    return { error: 'Order not found.' }
  }

  try {
    const portfolioWithOrders = await db.portfolio.findFirst({
      include: { orders: true },
      where: {
        id: orderToDelete.portfolioId,
        orders: {
          some: { stockId: orderToDelete.stockId },
        },
      },
    })

    if (!portfolioWithOrders) {
      logger.debug(
        'deleteOrder (not_found): id=%s portfolioId=%s',
        orderToDelete.id,
        orderToDelete.portfolioId,
      )
      return { error: 'Portfolio not found.' }
    }

    validateOrder(portfolioWithOrders, orderToDelete)
    await db.portfolioOrder.update({
      data: { deleted: true },
      where: { id: orderId },
    })
  } catch (error) {
    if (error instanceof Error) {
      logger.error('deleteOrder (error): error=%s', error.message)
    }
    return { error: 'Error deleting order.' }
  }

  revalidatePath(`/p/${orderToDelete.portfolioId}`)
  logger.debug('deleteOrder (done): orderId=%s', orderId)
  return { success: true }
}
