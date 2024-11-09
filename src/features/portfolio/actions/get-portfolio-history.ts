'use server';

import { calcPortfolioHistory } from '@/features/portfolio/lib/calc-portfolio-history';
import {
  PortfolioHistoryProps,
  PortfolioHistorySchema,
} from '@/features/portfolio/lib/validators';
import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

/**
 * Get the portfolio's merged chart history.
 * @param values `PortfolioHistorySchema` validator
 * @returns Success or error JSON object
 */
export const getPortfolioHistory = async (values: PortfolioHistoryProps) => {
  const { data, success, error } = PortfolioHistorySchema.safeParse(values);
  if (!success) {
    logger.debug(
      'getPortfolioHistory (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return;
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
    return;
  }

  if (portfolio.isPublic) {
    try {
      const history = await calcPortfolioHistory(data);
      logger.debug('getPortfolioHistory (done): portfolioId=%s', portfolioId);
      return history;
    } catch (error) {
      if (error instanceof Error) {
        logger.error('getPortfolioHistory (error): error=%s', error.message);
      }
      return;
    }
  }

  const user = await getUser();
  if (user?.id !== portfolio.userId) {
    logger.debug(
      'getPortfolioHistory (forbidden): portfolioId=%s, userId=%s',
      portfolioId,
      user?.id,
    );
    return;
  }

  try {
    const history = await calcPortfolioHistory(data);
    logger.debug('getPortfolioHistory (done): portfolioId=%s', portfolioId);
    return history;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('getPortfolioHistory (error): error=%s', error.message);
    }
  }
};
