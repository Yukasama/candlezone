'use server';

import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getQuote } from '@/lib/fmp/quote/quote';
import { logger } from '@/lib/logger';
import {
  RemovePositionProps,
  RemovePositionSchema,
} from '@/lib/validators/portfolio';
import { OrderType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

/**
 * Delete an order from a portfolio.
 * @param values `RemovePositionSchema` validator
 * @returns Success or error JSON object
 */
export const removePosition = async (values: RemovePositionProps) => {
  const validatedFields = RemovePositionSchema.safeParse(values);
  if (!validatedFields.success) {
    logger.debug(
      'removePosition (invalid_data): values=%o, issues=%o',
      values,
      validatedFields.error.issues,
    );
    return { error: 'Invalid data.' };
  }

  const { portfolioId, stockId } = validatedFields.data;

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
    db.portfolio.findFirst({
      include: { orders: true },
      where: {
        id: portfolioId,
        orders: {
          some: { stockId },
        },
      },
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

  const currentQuantity = portfolio.orders.reduce(
    (acc, order) => acc + order.quantity,
    0,
  );

  if (currentQuantity <= 0) {
    logger.debug(
      'removePosition (invalid_data): portfolioId=%s userId=%s currentQuantity=%s',
      portfolioId,
      user.id,
      currentQuantity,
    );
    return { error: 'Invalid quantity.' };
  }

  const quote = await getQuote({ symbol: stock?.symbol, retries: 3 });
  if (!quote) {
    logger.error('removePosition (error): stockId=%s', stockId);
    return { error: 'Error getting stock quote.' };
  }

  const sellOrder = {
    portfolioId,
    stockId,
    date: new Date(),
    quantity: currentQuantity,
    price: quote?.price,
    type: 'SELL' as OrderType,
  };

  try {
    await db.portfolioOrder.create({
      data: sellOrder,
    });
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
