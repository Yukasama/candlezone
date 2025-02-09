'use server';

import { appConfig } from '@/config/app';
import { getUser } from '@/features/auth/actions/get-user';
import { fmpClient } from '@/lib/axios';
import { db } from '@/lib/db';
import { Ratios } from '@/lib/fmp/types/stock';
import { logger } from '@/lib/logger';
import { notFound } from 'next/navigation';

const { symbolsPerBatch, batchDelay, mileStone, stocksToUpdate } =
  appConfig.update;

export const updateRatios = async () => {
  const user = await getUser();

  if (!user) {
    logger.debug('updateRatios (unauthorized)');
    return notFound();
  }

  if (user.role !== 'ADMIN') {
    logger.debug('updateRatios (forbidden) userId=%s', user.id);
    return notFound();
  }

  const startTime = Date.now();

  const symbolsData = await db.stock.findMany({
    select: { symbol: true },
    where: { isEtf: false },
    orderBy: { mktCap: 'desc' },
    take: stocksToUpdate,
  });

  const symbols = symbolsData.map((s) => s.symbol);

  if (symbols.length === 0) {
    logger.error('updateRatios (internal_error): error=Symbol fetch failed.');
    return { error: 'Internal server error.' };
  }

  logger.info('updateRatios (upload_initialized): symbols=%s', symbols.length);

  const symbolBatches = [];
  for (let i = 0; i < symbols.length; i += symbolsPerBatch) {
    symbolBatches.push(symbols.slice(i, i + symbolsPerBatch));
  }

  let uploadedSymbols = 0;
  for (let i = 0; i < symbolBatches.length; i++) {
    const { batchData, uploadedSymbols: newCount } = await processBatch(
      symbolBatches[i],
      uploadedSymbols,
      symbols.length,
      startTime,
    );
    uploadedSymbols = newCount;

    await executeTransaction(batchData);

    if (i < symbolBatches.length - 1) {
      await delay(batchDelay);
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(0);
  logger.info(
    'updateRatios (done): totalSymbols=%s, time=%ss.',
    symbols.length,
    totalTime,
  );

  return { success: 'Stock ratios upload complete.' };
};

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const processBatch = async (
  batch: string[],
  uploadedSymbols: number,
  totalSymbols: number,
  startTime: number,
) => {
  const batchData: (Ratios & { symbol: string })[] = [];

  for (const symbol of batch) {
    try {
      const { data } = await fmpClient.get<Ratios[] | undefined>(
        `v3/ratios-ttm/${symbol}`,
      );
      if (data && data.length > 0) {
        batchData.push({ ...data[0], symbol });
      } else {
        logger.warn('updateRatios (no_data): symbol=%s', symbol);
      }
    } catch (error) {
      logger.error(
        'updateRatios (fetch_error): symbol=%s error=%s',
        symbol,
        error,
      );
    }

    uploadedSymbols++;
    if (uploadedSymbols % mileStone === 0 || uploadedSymbols === totalSymbols) {
      const percentage = ((uploadedSymbols / totalSymbols) * 100).toFixed(0);
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(0);
      logger.debug(
        `updateRatios (batch_done): status=${percentage}%, time=${elapsedTime}s`,
      );
    }
  }

  return { batchData, uploadedSymbols };
};

const executeTransaction = async (batch: (Ratios & { symbol: string })[]) => {
  if (batch.length === 0) {
    return 0;
  }

  const updateOperations = batch.map((ratios) => {
    const data = {
      ...ratios,
      priceBookValueRatioTTM: undefined,
      priceToOperatingCashFlowsRatioTTM: undefined,
      priceSalesRatioTTM: undefined,
      priceFairValueTTM: undefined,
      dividendYieldTTM: undefined,
    };

    return db.stock.update({
      where: { symbol: ratios.symbol },
      data,
    });
  });

  try {
    const results = await db.$transaction(updateOperations);
    return results.length;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('updateRatios (db_error): error=%s', error.message);
    }
    return 0;
  }
};
