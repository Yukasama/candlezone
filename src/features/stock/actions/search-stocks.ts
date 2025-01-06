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
  const { data, success, error } = SearchSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'searchStocks (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return [];
  }

  const { input } = data;

  const exactMatch = await db.stock.findUnique({
    select: {
      id: true,
      symbol: true,
      image: true,
      companyName: true,
      isEtf: true,
      range: true,
    },
    where: {
      symbol: input.toUpperCase(),
    },
  });

  const searchResults = await db.stock.findMany({
    select: {
      id: true,
      symbol: true,
      image: true,
      companyName: true,
      isEtf: true,
      range: true,
    },
    where: {
      AND: [
        {
          OR:
            input.length > 3
              ? [
                  { symbol: { startsWith: input.toUpperCase() } },
                  { companyName: { contains: input } },
                ]
              : [{ symbol: { startsWith: input.toUpperCase() } }],
        },
        exactMatch ? { symbol: { not: input } } : {},
      ],
    },
    orderBy: { mktCap: 'desc' },
    take: 7,
  });

  const combinedResults = exactMatch
    ? [exactMatch, ...searchResults]
        .filter(
          (entry, index, self) =>
            index === self.findIndex((e) => e.symbol === entry.symbol),
        )
        .slice(0, Math.min(7, searchResults.length + 1))
    : searchResults;

  logger.debug(
    'searchStocks (done): search=%s, exactMatch=%s, results=%s',
    input,
    exactMatch ? 1 : 0,
    combinedResults.length,
  );

  return combinedResults;
};
