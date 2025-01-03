'use server';

import { getUser } from '@/features/auth/actions/get-user';
import {
  UpdatePortfolioProps,
  UpdatePortfolioSchema,
} from '@/features/portfolio/lib/validators';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';

/**
 * Update portfolio information.
 * @param values `UpdatePortfolioSchema` validator
 * @returns Success or error JSON object
 */
export const updatePortfolio = async (values: UpdatePortfolioProps) => {
  const { data, success, error } = UpdatePortfolioSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'updatePortfolio (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return { error: 'Invalid data.' };
  }

  const { portfolioId, title, isPublic, color } = data;

  const user = await getUser();
  if (!user) {
    logger.debug('updatePortfolio (unauthorized): portfolioId=%s', portfolioId);
    return { error: 'Unauthorized.' };
  }

  try {
    await db.portfolio.update({
      data: {
        ...(title && { title }),
        ...(isPublic !== undefined && { isPublic: !!isPublic }),
        ...(color && { color }),
      },
      where: {
        id: portfolioId,
        userId: user.id,
      },
    });

    revalidatePath(`/p/${portfolioId}`);
    logger.debug(
      'updatePortfolio (done): portfolioId=%s, data=%o',
      portfolioId,
      data,
    );
    return { success: 'Portfolio updated successfully.' };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        'updatePortfolio (error): portfolioId=%s, userId=%s, error=%s',
        portfolioId,
        user.id,
        error.message,
      );
    }
    return { error: 'Portfolio could not be updated.' };
  }
};
