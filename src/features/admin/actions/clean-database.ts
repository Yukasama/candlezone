'use server';

import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { isStockValid } from '@/lib/utils/stock-helper';

/**
 * Clean database by deleting stocks with error messages.
 * @returns Deleted count of stocks with error messages.
 */
export const cleanDatabase = async () => {
  const stocks = await db.stock.findMany({
    select: { symbol: true, companyName: true, isFund: true },
  });

  const invalidSymbols = stocks
    .filter(
      (stock) =>
        !isStockValid({
          symbol: stock.symbol,
          name: stock.companyName,
          price: 20,
          type: !stock.isFund,
        }),
    )
    .map((stock) => stock.symbol);

  const deleted = await db.stock.deleteMany({
    where: {
      OR: [
        { errorMsg: { not: undefined } },
        { symbol: { in: invalidSymbols } },
      ],
    },
  });

  logger.info(
    'cleanDatabase (done): deleted=%s, invalidSymbols=%s',
    deleted.count,
    invalidSymbols.length,
  );

  return deleted;
};
