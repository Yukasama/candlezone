'use server';

import {
  UpdateOrderProps,
  UpdateOrderSchema,
} from '@/features/order/lib/validators';
import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';
import { validateOrder } from '../lib/validate-order';

/**
 * Update an order from a portfolio.
 * @param values `UpdateOrderSchema` validator
 * @returns Success or error JSON object
 */
export const updateOrder = async (values: UpdateOrderProps) => {
  const validatedFields = UpdateOrderSchema.safeParse(values);
  if (!validatedFields.success) {
    logger.debug(
      'updateOrder (invalid_data): values=%o, issues=%o',
      values,
      validatedFields.error.issues,
    );
    return { error: 'Invalid data.' };
  }

  const order = validatedFields.data;

  const user = await getUser();
  if (!user) {
    logger.debug('updateOrder (unauthorized): order=%o', order);
    return { error: 'Unauthorized.' };
  }

  const orderToUpdate = await db.portfolioOrder.findFirst({
    where: {
      id: order.id,
      portfolio: { userId: user.id },
    },
  });

  if (!orderToUpdate || orderToUpdate.deleted) {
    logger.debug(
      'updateOrder (not_found): orderId=%s userId=%s',
      order.id,
      user.id,
    );
    return { error: 'Order not found.' };
  }

  try {
    const portfolioWithOrders = await db.portfolio.findFirst({
      include: { orders: true },
      where: {
        id: orderToUpdate.portfolioId,
        orders: {
          some: {
            stockId: orderToUpdate.stockId,
          },
        },
      },
    });

    if (!portfolioWithOrders) {
      logger.debug(
        'updateOrder (not_found): id=%s portfolioId=%s',
        orderToUpdate.id,
        orderToUpdate.portfolioId,
      );
      return { error: 'Portfolio not found.' };
    }

    validateOrder(portfolioWithOrders, { ...orderToUpdate, ...order });
    await db.portfolioOrder.update({
      data: order,
      where: {
        id: order.id,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        'updateOrder (error): error=%s order=%o',
        error.message,
        order,
      );
      return { error: error.message };
    }
    return { error: 'Failed to update order.' };
  }

  revalidatePath(`/p/${orderToUpdate.portfolioId}`);
  logger.debug('updateOrder (done): order=%o', order);
  return { success: true };
};
