'use server';

import { SearchProps, SearchSchema } from '@/features/stock/lib/validators';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

/**
 * Search stocks based on search term.
 * @param values `SearchSchema` validator
 * @returns Success or error JSON object
 */
export const searchStocks = async (values: SearchProps) => {
  const validatedFields = SearchSchema.safeParse(values);
  if (!validatedFields.success) {
    logger.debug(
      'searchStocks (invalid_data): values=%o, issues=%o',
      values,
      validatedFields.error.issues,
    );
    return [];
  }

  const { input } = validatedFields.data;

  const data = await db.stock.findMany({
    select: {
      id: true,
      symbol: true,
      image: true,
      companyName: true,
      isEtf: true,
    },
    where: {
      OR: [
        { symbol: { startsWith: input, mode: 'insensitive' } },
        { companyName: { startsWith: input, mode: 'insensitive' } },
      ],
    },
    take: 7,
  });

  logger.debug(
    'searchStocks (done): search=%s, results=%s',
    input,
    data.length,
  );

  return data;
};
