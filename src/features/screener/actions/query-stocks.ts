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
  const { data, error, success } = ScreenerSchema.safeParse(values);
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
    orderBy: { symbol: 'asc' },
    select: {
      companyName: true,
      country: true,
      id: true,
      image: true,
      marketCap: true,
      netProfitMarginTTM: true,
      priceToBookRatioTTM: true,
      priceToEarningsRatioTTM: true,
      priceToSalesRatioTTM: true,
      range: true,
      sector: true,
      symbol: true,
    },
    skip,
    take,
    where: filter,
  });

  logger.debug(
    'queryStocks (done): results=%s, cursor=%s',
    results.length,
    cursor,
  );

  return results;
};
