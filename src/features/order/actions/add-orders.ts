'use server';

import { getUser } from '@/features/auth/actions/get-user';
import {
  AddOrdersProps,
  AddOrdersSchema,
} from '@/features/order/lib/validators';
import { getStockQuotes } from '@/features/stock/lib/get-stock-quotes';
import { db } from '@/lib/db';
import { getQuote } from '@/lib/fmp/quote/get-quote';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';
import { validateOrder } from '../lib/validate-order';

/**
 * Add orders to a portfolio.
 * @param values `AddOrdersSchema` validator
 * @returns Success or error JSON object
 */
export const addOrders = async (values: AddOrdersProps) => {
  const { data, error, success } = AddOrdersSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'addOrders (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return { error: 'Invalid data.' };
  }

  const { orders, portfolioId } = data;

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
    db.portfolio.findUnique({
      include: { orders: true },
      where: {
        id: portfolioId,
        userId: user.id,
      },
    }),
    db.stock.findMany({
      select: {
        companyName: true,
        id: true,
        sector: true,
        symbol: true,
      },
      where: { id: { in: orders.map(({ stockId }) => stockId) } },
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
        if (!stock) {
          throw new Error('Stock not available.');
        }

        try {
          const quote = stock.price
            ? stock
            : await getQuote({ symbol: stock.symbol });
          const price = quote?.price;
          if (!price) {
            throw new Error('Stock price not available.');
          }

          validateOrder(portfolio, order);
          return await db.portfolioOrder.create({
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
          failedOrders.push(stock.symbol);
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
    error: failedOrders.length > 0 ? 'Some orders failed.' : undefined,
    success: true,
  };
};
