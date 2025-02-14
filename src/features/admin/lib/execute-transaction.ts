import { db } from '@/lib/db';
import { createStock } from '@/lib/fmp/stock-factory';
import { Earnings } from '@/lib/fmp/types/info';
import { logger } from '@/lib/logger';
import type { Prisma, Stock } from '@prisma/client';
import { StockDCF } from '../types/upload';
import { upsertEarnings } from './update-earnings';

interface FlattenedData {
  dcf?: StockDCF;
  earnings?: Earnings[];
  earningsDate?: string;
  peersList?: string;
  profile: Stock;
  ratiosTTM?: Stock;
}

export const executeTransaction = async (batch: FlattenedData[]) => {
  try {
    const results = await Promise.all(
      batch.map(async (item) => {
        return db.$transaction(async (tx: Prisma.TransactionClient) => {
          const commonData = createStock(item);
          const stock = await tx.stock.upsert({
            create: commonData,
            select: { id: true },
            update: commonData,
            where: { symbol: item.profile.symbol },
          });
          console.log(item.profile.symbol);

          if (item.earnings?.length) {
            await upsertEarnings(tx, stock.id, item.earnings);
          }

          return 1;
        });
      }),
    );

    return results.filter(Boolean).length;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('executeTransaction (error): %s', error.message);
    }
    return 0;
  }
};
