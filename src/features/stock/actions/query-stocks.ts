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
  const validatedFields = ScreenerSchema.safeParse(values);
  if (!validatedFields.success) {
    logger.debug(
      'queryStocks (invalid_data): values=%o, issues=%o',
      values,
      validatedFields.error.issues,
    );
    return [];
  }

  const { cursor = 1, take = 10 } = validatedFields.data;
  const filter = buildFilter(validatedFields.data);
  const skip = (cursor - 1) * take;

  const data = await db.stock.findMany({
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
    take,
    skip,
    orderBy: { symbol: 'asc' },
  });

  logger.debug(
    'queryStocks (done): results=%s, cursor=%s',
    data.length,
    cursor,
  );

  return data;
};
