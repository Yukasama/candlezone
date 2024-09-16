'use server';

import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getQuote, getStockQuotes } from '@/lib/fmp/quote/quote';
import { logger } from '@/lib/logger';
import { AddOrdersProps, AddOrdersSchema } from '@/lib/validators/portfolio';
import { revalidatePath } from 'next/cache';
import { validateOrder } from '../lib/validate-order';

/**
 * Add orders to a portfolio.
 * @param values `AddOrdersSchema` validator
 * @returns Success or error JSON object
 */
export const addOrders = async (values: AddOrdersProps) => {
  const validatedFields = AddOrdersSchema.safeParse(values);
  if (!validatedFields.success) {
    logger.debug(
      'addOrders (invalid_data): values=%o, issues=%o',
      values,
      validatedFields.error.issues,
    );
    return { error: 'Invalid data.' };
  }

  const { portfolioId, orders } = validatedFields.data;

  const user = await getUser();
  if (!user) {
    logger.debug(
      'addOrders (unauthorized): portfolioId=%s orders=%o',
      portfolioId,
      orders,
    );
    return { error: 'Unauthorized.' };
  }

  const [portfolio, stocksToAdd] = await Promise.all([
    db.portfolio.findFirst({
      include: {
        orders: true,
      },
      where: {
        id: portfolioId,
        userId: user.id,
      },
    }),
    db.stock.findMany({
      select: {
        id: true,
        symbol: true,
        companyName: true,
      },
      where: {
        id: { in: orders.map((order) => order.stockId) },
      },
    }),
  ]);

  if (!portfolio) {
    logger.debug(
      'addOrders (not_found): portfolioId=%s userId=%s',
      portfolioId,
      user.id,
    );
    return { error: 'Portfolio not found.' };
  }

  const quotes = await getStockQuotes(stocksToAdd);

  const failedOrders: string[] = [];
  try {
    await db.$transaction(async (db) => {
      const orderPromises = orders.map(async (order) => {
        const stock = quotes.find((quote) => quote.id === order.stockId);
        try {
          const quote = stock?.price
            ? stock
            : await getQuote({ symbol: stock?.symbol });
          const price = quote?.price;
          if (!price) {
            throw new Error('Stock price not available.');
          }

          validateOrder(portfolio, order);
          return db.portfolioOrder.create({
            data: {
              portfolioId: portfolio.id,
              ...order,
              price: order.price ?? price,
            },
          });
        } catch (error) {
          if (error instanceof Error) {
            logger.debug('addOrders (error): error=%s', error.message);
          }
          failedOrders.push(stock?.symbol ?? 'unknown');
        }
      });
      await Promise.all(orderPromises.filter(Boolean));
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error('addOrders (error): error=%s', error.message);
    }
    return { error: 'Internal server error' };
  }

  revalidatePath(`/p/${portfolioId}`);
  logger.debug(
    'addOrders (done): portfolioId=%s, orders=%o',
    portfolioId,
    orders,
  );
  return {
    success: true,
    error: failedOrders.length > 0 ? 'Some orders failed.' : undefined,
  };
};
