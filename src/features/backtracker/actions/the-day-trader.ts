'use server';

import {
  TheDayTraderProps,
  TheDayTraderSchema,
} from '@/features/backtracker/lib/validators';
import { getHistory } from '@/features/stock/actions/get-history';
import { logger } from '@/lib/logger';

/**
 * Backtrack a stock's history.
 * @param values `TheDayTraderSchema` validator
 * @returns Stats for the run.
 */
export const theDayTrader = async (values: TheDayTraderProps) => {
  const { data, error, success } = TheDayTraderSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'theDayTrader (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return { error: 'Invalid data.' };
  }

  return await getHistory({ ...data, all: true });
};
