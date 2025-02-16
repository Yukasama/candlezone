'use server';

import { getUser } from '@/features/auth/actions/get-user';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { isStockValid } from '@/lib/utils/stock-helper';

/**
 * Clean database by deleting stocks with error messages.
 * @returns Deleted count of stocks with error messages.
 */
export const cleanDatabase = async () => {
  const user = await getUser();
  if (!user) {
    logger.warn('CRON-upload-stocks (unauthorized): user=%o', user);
    return { error: 'Unauthorized' };
  }

  if (user.role !== 'ADMIN') {
    logger.warn('CRON-upload-stocks (done) userId=%s', user.id);
    return { error: 'Forbidden' };
  }

  const stocks = await db.stock.findMany({
    select: {
      companyName: true,
      isFund: true,
      marketCap: true,
      sector: true,
      symbol: true,
      website: true,
    },
  });

  const invalidSymbols = stocks
    .filter((stock) => !isStockValid(stock))
    .map((stock) => stock.symbol);

  const deleted = await db.stock.deleteMany({
    where: {
      OR: [{ symbol: { in: invalidSymbols } }],
    },
  });

  logger.info(
    'cleanDatabase (done): deleted=%s, invalidSymbols=%s',
    deleted.count,
    invalidSymbols.length,
  );

  return deleted;
};
