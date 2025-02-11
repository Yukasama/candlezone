import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import type { Stock } from '@prisma/client';
import { StockDCF } from '../types/dcf';

interface FlattenedData {
  dcf?: StockDCF;
  earningsDate?: string;
  peersList?: string;
  profile: Stock;
  ratiosTTM?: Stock;
}

export const executeTransaction = async (batch: FlattenedData[]) => {
  const upsertData = batch.map(
    ({ dcf, earningsDate, peersList, profile, ratiosTTM }) => {
      const commonData = {
        ...ratiosTTM,
        ...dcf,
        ...profile,
        changes: undefined,
        defaultImage: undefined,
        earningsDate: earningsDate && new Date(earningsDate),
        exchange: undefined,
        ipoDate: undefined,
        isAdr: undefined,
        isFund: undefined,
        lastDiv: undefined,
        peersList,
        phone: undefined,
        price: undefined,
        volAvg: undefined,
      };

      return {
        create: commonData,
        update: commonData,
        where: { symbol: profile.symbol },
      };
    },
  );

  try {
    const results = await db.$transaction(
      upsertData.map((data) =>
        db.stock.upsert({ ...data, select: { id: true } }),
      ),
    );
    return results.length;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('executeTransaction (error): %s', error.message);
    }
    return 0;
  }
};
