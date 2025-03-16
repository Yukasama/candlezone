'use server';

import { getUser } from '@/features/auth/actions/get-user';
import {
  RemovePositionProps,
  RemovePositionSchema,
} from '@/features/order/lib/validators';
import { db } from '@/lib/db';
import { getQuote } from '@/lib/fmp/quote/get-quote';
import { logger } from '@/lib/logger';
import type { OrderType } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { validateOrder } from '../lib/validate-order';

/**
 * Delete an order from a portfolio.
 * @param values `RemovePositionSchema` validator
 * @returns Success or error JSON object
 */
export const removePosition = async (values: RemovePositionProps) => {
  const { data, error, success } = RemovePositionSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'removePosition (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return { error: 'Invalid data.' };
  }

  const { portfolioId, stockId } = data;

  const user = await getUser();
  if (!user) {
    logger.debug(
      'removePosition (unauthorized): portfolioId=%s stockId=%s',
      portfolioId,
      stockId,
    );
    return { error: 'Unauthorized.' };
  }

  const [portfolio, stock] = await Promise.all([
    db.portfolio.findUnique({
      include: {
        orders: {
          where: {
            NOT: { deleted: null },
            stockId: stockId,
          },
        },
      },
      where: { id: portfolioId },
    }),
    db.stock.findUnique({
      select: { symbol: true },
      where: { id: stockId },
    }),
  ]);

  if (!portfolio) {
    logger.debug(
      'removePosition (not_found): portfolioId=%s userId=%s',
      portfolioId,
      user.id,
    );
    return { error: 'Portfolio not found.' };
  }

  if (!stock) {
    logger.debug('removePosition (error): stockId=%s', stockId);
    return { error: 'Stock not found.' };
  }

  let currentQuantity = 0;

  for (const order of portfolio.orders) {
    if (order.type === 'BUY') {
      currentQuantity += order.quantity;
    } else {
      currentQuantity -= order.quantity;
    }
  }

  if (currentQuantity <= 0) {
    logger.debug(
      'removePosition (invalid_data): portfolioId=%s userId=%s currentQuantity=%s',
      portfolioId,
      user.id,
      currentQuantity,
    );
    return { error: 'Invalid quantity.' };
  }

  const quote = await getQuote({ retries: 3, symbol: stock.symbol });
  if (!quote?.price) {
    logger.error('removePosition (error): stockId=%s', stockId);
    return { error: 'Error getting stock quote.' };
  }

  const sellOrder = {
    date: new Date(),
    portfolioId,
    price: quote.price,
    quantity: currentQuantity,
    stockId,
    type: 'SELL' as OrderType,
  };

  try {
    validateOrder(portfolio, sellOrder);
    await db.portfolioOrder.create({ data: sellOrder });
  } catch (error) {
    if (error instanceof Error) {
      logger.error('removePosition (error): error=%s', error.message);
    }
    return { error: 'Error deleting order.' };
  }

  revalidatePath(`/p/${portfolioId}`);
  logger.debug(
    'removePosition (done): portfolioId=%s stockId=%s',
    portfolioId,
    stockId,
  );
  return { success: true };
};
