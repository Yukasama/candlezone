'use server';

import { getUser } from '@/features/auth/actions/get-user';
import { calcPortfolioHistory } from '@/features/portfolio/lib/calc-portfolio-history';
import {
  PortfolioHistoryProps,
  PortfolioHistorySchema,
} from '@/features/portfolio/lib/validators';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { unstable_cacheLife as cacheLife } from 'next/cache';

/**
 * Get the portfolio's merged chart history.
 *
 * @param values `PortfolioHistorySchema` validator
 * @returns Success or error JSON object
 */
export const getPortfolioHistory = async (values: PortfolioHistoryProps) => {
  'use cache';
  cacheLife('minutes');

  try {
    const { data, error, success } = PortfolioHistorySchema.safeParse(values);
    if (!success) {
      logger.debug(
        'getPortfolioHistory (invalid_data): values=%o, issues=%o',
        values,
        error.issues,
      );
      throw new Error('Invalid data');
    }

    const { portfolioId } = data;

    const portfolio = await db.portfolio.findUnique({
      select: {
        isPublic: true,
        userId: true,
      },
      where: { id: portfolioId },
    });

    if (!portfolio) {
      logger.debug(
        'getPortfolioHistory (not_found): portfolioId=%s',
        portfolioId,
      );
      throw new Error('Not found');
    }

    const user = await getUser();
    if (!portfolio.isPublic && user?.id !== portfolio.userId) {
      logger.debug(
        'getPortfolioHistory (error): error=Portfolio not public, portfolioId=%s, userId=%s',
        portfolioId,
        user?.id,
      );
      throw new Error('Portfolio not public');
    }

    const history = await calcPortfolioHistory(data);
    logger.debug('getPortfolioHistory (done): portfolioId=%s', portfolioId);
    return history;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('getPortfolioHistory (error): error=%s', error);
    }
  }
};
