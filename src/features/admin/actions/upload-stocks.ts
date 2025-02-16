import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { fetchData } from '../lib/fetch-data';
import { preprocessData } from '../lib/preprocess-data';
import { upsertManyStocks } from '../lib/upsert-many';

export const uploadStocks = async () => {
  logger.info('uploadStocks (start)');
  const startTime = Date.now();

  const stocks = await fetchData({ startTime });
  const { creates, earningsData, updates, updatesSkipped } =
    await preprocessData({ startTime, stocks });

  console.log(creates);

  let createCount = 0;
  let earningsCreateCount = 0;

  await db.$transaction(
    async (tx) => {
      if (creates.length > 0) {
        const created = await tx.stock.createMany({ data: creates });
        createCount += created.count;
      }
      if (earningsData.length > 0) {
        await tx.earnings.createMany({ data: earningsData });
        earningsCreateCount += earningsData.length;
      }
    },
    { timeout: 60000 },
  );

  logger.info(
    'uploadStocks (creates_done): time=%ss, tx=[createCount=%s, earningsCreateCount=%s]',
    ((Date.now() - startTime) / 1000).toFixed(1),
    createCount,
    earningsCreateCount,
  );

  if (updates.length > 0) {
    const updateCount = await upsertManyStocks(updates, startTime);
    logger.info(
      'uploadStocks (done): time=%ss, tx=[createCount=%s, updateCount=%s, earningsCount=%s, updatesSkipped=%s]',
      ((Date.now() - startTime) / 1000).toFixed(1),
      createCount,
      updateCount,
      earningsCreateCount,
      updatesSkipped,
    );
  }

  return { success: 'Stock upload complete.' };
};
