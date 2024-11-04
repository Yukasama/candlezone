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
  const validatedFields = TheDayTraderSchema.safeParse(values);
  if (!validatedFields.success) {
    logger.debug(
      'theDayTrader (invalid_data): values=%o, issues=%o',
      values,
      validatedFields.error.issues,
    );
    return { error: 'Invalid data.' };
  }

  const { symbol, timeframe } = validatedFields.data;

  return await getHistory({ symbol, timeframe, all: true });
};
