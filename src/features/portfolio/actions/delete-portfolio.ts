'use server';

import {
  DeletePortfolioProps,
  DeletePortfolioSchema,
} from '@/features/portfolio/lib/validators';
import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

/**
 * Delete a portfolio.
 * @param values `DeletePortfolioSchema` validator
 * @returns Success or error JSON object
 */
export const deletePortfolio = async (values: DeletePortfolioProps) => {
  const validatedFields = DeletePortfolioSchema.safeParse(values);
  if (!validatedFields.success) {
    logger.debug(
      'deletePortfolio (invalid_data): values=%o, issues=%o',
      values,
      validatedFields.error.issues,
    );
    return { error: 'Invalid data.' };
  }

  const { portfolioId } = validatedFields.data;

  const user = await getUser();
  if (!user) {
    logger.debug('deletePortfolio (unauthorized): portfolioId=%s', portfolioId);
    return { error: 'Unauthorized.' };
  }

  try {
    const portfolio = await db.portfolio.delete({
      where: {
        id: portfolioId,
        userId: user.id,
      },
    });

    if (!portfolio) {
      throw new Error('Portfolio not found.');
    }

    logger.debug('deletePortfolio (done): portfolioId=%s', portfolioId);
    return { success: 'Portfolio deleted successfully.' };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        'deletePortfolio (error): portfolioId=%s, userId=%s, error=%s',
        portfolioId,
        user.id,
        error.message,
      );
    }
    return { error: 'Portfolio could not be deleted.' };
  }
};
