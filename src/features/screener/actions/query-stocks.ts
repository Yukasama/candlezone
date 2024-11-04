'use server';

import { buildFilter } from '@/features/screener/lib/build-filter';
import {
  ScreenerProps,
  ScreenerSchema,
} from '@/features/screener/lib/validators';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

/**
 * Query stocks based on screener criteria.
 * @param values `ScreenerSchema` validator
 * @returns Success or error JSON object
 */
export const queryStocks = async (values: ScreenerProps) => {
  const { data, success, error } = ScreenerSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'queryStocks (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return [];
  }

  const { cursor, take } = data;

  const filter = buildFilter(data);
  const skip = (cursor - 1) * take;

  const results = await db.stock.findMany({
    select: {
      id: true,
      symbol: true,
      image: true,
      companyName: true,
      sector: true,
      country: true,
      peRatioTTM: true,
      mktCap: true,
      netProfitMarginTTM: true,
    },
    where: filter,
    orderBy: { symbol: 'asc' },
    take,
    skip,
  });

  logger.debug(
    'queryStocks (done): results=%s, cursor=%s',
    results.length,
    cursor,
  );

  return results;
};
