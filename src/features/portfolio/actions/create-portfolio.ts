'use server';

import { getUser } from '@/features/auth/actions/get-user';
import { addOrders } from '@/features/order/actions/add-orders';
import {
  CreatePortfolioProps,
  CreatePortfolioSchema,
} from '@/features/portfolio/lib/validators';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { getRandomColor } from '@/lib/utils/generate-colors';

/**
 * Create a portfolio.
 * @param values `CreatePortfolioSchema` validator
 * @returns Success or error JSON object
 */
export const createPortfolio = async (values: CreatePortfolioProps) => {
  const { data, success, error } = CreatePortfolioSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'createPortfolio (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return { error: 'Invalid data.' };
  }

  const { title, isPublic, orders } = data;

  const user = await getUser();
  if (!user) {
    logger.debug('createPortfolio (unauthorized): title=%s', title);
    return { error: 'Unauthorized.' };
  }

  try {
    const portfolio = await db.portfolio.create({
      data: {
        title,
        isPublic: !!isPublic,
        userId: user.id,
        color: getRandomColor(),
      },
    });

    if (orders?.length) {
      await addOrders({ portfolioId: portfolio.id, orders });
    }

    logger.debug(
      'createPortfolio (done): portfolioId=%s, title=%s, isPublic=%s orders=%o',
      portfolio.id,
      title,
      isPublic,
      orders,
    );

    return { portfolioId: portfolio.id };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        'createPortfolio (error): user=%s error=%s',
        user.email,
        error.message,
      );
    }
    return { error: 'Failed to create portfolio.' };
  }
};
