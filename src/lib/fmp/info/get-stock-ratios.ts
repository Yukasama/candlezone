import { db } from '@/lib/db';
import { isSymbolValid } from '@/utils/stock-helper';
import { updateMetrics } from './update-metrics';

/**
 * Fetches stock data from the Financial Modeling Prep API and adds it to the database.
 * @param symbol Symbol to return and add to the database.
 * @returns Stock object from the database or undefined.
 */
export const getStockRatios = async ({ symbol }: { symbol: string }) => {
  if (!isSymbolValid(symbol)) {
    return;
  }

  const stockDb = await db.stock.findFirst({
    include: { financials: true },
    where: { symbol: symbol.toUpperCase() },
  });

  if (!stockDb) {
    return;
  }

  const twoHoursAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

  if (
    stockDb.updatedAt > twoHoursAgo &&
    stockDb.financials.length > 0 &&
    stockDb.peRatioTTM
  ) {
    return stockDb;
  }

  return await updateMetrics(stockDb);
};
