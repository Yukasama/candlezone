'use server';

import { getUser } from '@/features/auth/actions/get-user';
import { addOrders } from '@/features/order/actions/add-orders';
import { PLANS } from '@/features/payment/config/plans';
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
  const { data, error, success } = CreatePortfolioSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'createPortfolio (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return { error: 'Invalid data.' };
  }

  const { color, isPublic, orders, title } = data;

  const user = await getUser();
  if (!user) {
    logger.debug('createPortfolio (unauthorized): title=%s', title);
    return { error: 'Unauthorized.' };
  }

  if (user.role !== 'ADMIN') {
    const userPortfoliosCount = await db.portfolio.count({
      where: { userId: user.id },
    });

    const plan = PLANS[0];
    if (userPortfoliosCount >= plan.maxPortfolios) {
      logger.debug(
        'createPortfolio (max_portfolios): user=%s, count=%d, max=%d',
        user.id,
        userPortfoliosCount,
        plan.maxPortfolios,
      );
      return { error: 'Maximum number of portfolios reached.' };
    }
  }

  try {
    const publicDate = isPublic ? new Date() : undefined;
    const portfolio = await db.portfolio.create({
      data: {
        color: color ?? getRandomColor(),
        isPublic: publicDate,
        title,
        userId: user.id,
      },
    });

    if (orders?.length) {
      await addOrders({ orders, portfolioId: portfolio.id });
    }

    logger.debug(
      'createPortfolio (done): portfolioId=%s, title=%s, isPublic=%s, color=%s, orders=%o',
      portfolio.id,
      title,
      isPublic,
      color,
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
