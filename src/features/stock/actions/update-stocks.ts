'use server';

import { appConfig } from '@/config/app';
import { env } from '@/env.mjs';
import {
  UpdateStocksProps,
  UpdateStocksSchema,
} from '@/features/stock/lib/validators';
import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getEarnings } from '@/lib/fmp/info/get-earnings';
import { getSymbols } from '@/lib/fmp/info/get-symbols';
import { logger } from '@/lib/logger';
import { Stock } from '@prisma/client';
import { notFound } from 'next/navigation';
import pLimit from 'p-limit';
import { Earnings } from '../types/stock';

interface FlattenedData {
  profile: Stock;
  earnings?: Earnings;
  peersList: string;
}

interface StockPeer {
  symbol: string;
  peersList: string[];
}

const uploadConfig = appConfig.upload;

/**
 * Uploads descriptive stock data to the database.
 * @param values `UpdateStocksSchema` validator
 * @returns Status message for upload.
 */
export const updateStocks = async (values: UpdateStocksProps) => {
  const validatedFields = UpdateStocksSchema.safeParse(values);
  if (!validatedFields.success) {
    logger.debug(
      'updateStocks (invalid_data): values=%o, issues=%o',
      values,
      validatedFields.error.issues,
    );
    return { error: 'Invalid data.' };
  }

  const user = await getUser();

  if (!user) {
    logger.debug('updateStocks (unauthorized)');
    return notFound();
  }

  if (user?.role !== 'ADMIN') {
    logger.debug('updateStocks (forbidden) userId=%s', user.id);
    return notFound();
  }

  const { testRun } = validatedFields.data;

  const startTime = Date.now();
  const symbols = testRun ? ['AAPL', 'MSFT'] : await getSymbols();
  if (!symbols?.length) {
    logger.error('updateStocks (internal_error): error=Symbol fetch failed.');
    return { error: 'Internal server error.' };
  }

  logger.info(
    'updateStocks (upload_initialized): symbolCount=%s',
    symbols.length,
  );

  const symbolsPerFetch = Number(uploadConfig.symbolsPerFetch);
  const symbolBatches = Array.from(
    { length: Math.ceil(symbols.length / symbolsPerFetch) },
    (_, i) => symbols.slice(i * symbolsPerFetch, (i + 1) * symbolsPerFetch),
  );

  const fetchPromises = symbolBatches.map(async (batch, i) => {
    const symbolsBatchString = batch.join(',');
    const [profileResponse, stockPeerResponse] = await Promise.all([
      fetch(
        `${appConfig.fmp.url}v3/profile/${symbolsBatchString}?apikey=${env.FMP_API_KEY}`,
        { cache: 'no-store' },
      ),
      fetch(
        `${appConfig.fmp.url}v4/stock_peers?symbol=${symbolsBatchString}&apikey=${env.FMP_API_KEY}`,
        { cache: 'no-store' },
      ),
    ]);

    if (!profileResponse.ok || !stockPeerResponse.ok) {
      logger.error('updateStocks (fetch_failed): symbolBatchNr=%s', i);
      return [];
    }

    const profileData = (await profileResponse.json()) as Stock[];
    const stockPeerData = (await stockPeerResponse.json()) as StockPeer[];

    const stockPeerMap = new Map<string, string[]>();
    for (const peer of stockPeerData) {
      stockPeerMap.set(peer.symbol, peer.peersList || []);
    }

    return profileData
      .map((profile) => ({
        profile,
        peersList: (stockPeerMap.get(profile.symbol) ?? []).join(','),
      }))
      .filter((data) => data.profile.website !== '');
  });

  const earnings = await getEarnings();
  const fetchedData = await Promise.all(fetchPromises);
  const fetchEnd = Date.now() - startTime;
  logger.info(
    `updateStocks (fetch_done): time=%ss`,
    (fetchEnd / 1000).toFixed(0),
  );

  const flattenedData = fetchedData.flat();
  const dataWithEarnings = flattenedData.map((data) => {
    return {
      ...data,
      profile: { ...data.profile },
      earnings: earnings.find((entry) => entry.symbol === data.profile.symbol),
    };
  });

  let uploadedSymbols = 0;
  const limit = pLimit(uploadConfig.concurrencyLimit);

  const batchPromises = Array.from(
    { length: Math.ceil(dataWithEarnings.length / uploadConfig.batchSize) },
    (_, i) => {
      const batchStart = i * uploadConfig.batchSize;
      const batchEnd = Math.min(
        batchStart + uploadConfig.batchSize,
        dataWithEarnings.length,
      );
      const batch = dataWithEarnings.slice(batchStart, batchEnd);

      return limit(async () => {
        const successfulUploads = await executeTransaction(batch);
        uploadedSymbols += successfulUploads;
        if (
          uploadedSymbols % uploadConfig.mileStone === 0 &&
          uploadedSymbols !== 0
        ) {
          const percentage = Math.round(
            (uploadedSymbols / symbols.length) * 100,
          ).toFixed(0);
          const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(0);
          logger.info(
            `updateStocks (batch_done): status=${percentage}%, time=${elapsedTime}s`,
          );
        }
      });
    },
  );

  await Promise.all(batchPromises);

  const end = Date.now() - startTime;
  logger.info(
    `updateStocks (done): uploadedSymbols=%s, time=%ss.`,
    uploadedSymbols,
    (end / 1000).toFixed(0),
  );

  return { success: 'Stock upload complete.' };
};

const executeTransaction = async (batch: FlattenedData[]) => {
  const upsertData = batch.map(({ profile, earnings, peersList }) => {
    return {
      where: { symbol: profile.symbol },
      update: {
        ...profile,
        earningsDate: earnings?.date,
        earningsEps: earnings?.eps,
        earningsEpsEstimated: earnings?.epsEstimated,
        earningsTime: earnings?.time,
        earningsRevenue: earnings?.revenue,
        earningsRevenueEstimated: earnings?.revenueEstimated,
        peersList,
        price: undefined,
        volAvg: undefined,
        lastDiv: undefined,
        changes: undefined,
        phone: undefined,
        ipoDate: undefined,
        defaultImage: undefined,
        isAdr: undefined,
        targetHigh: undefined,
        targetLow: undefined,
        targetConsensus: undefined,
        targetMedian: undefined,
      },
      create: {
        ...profile,
        earningsDate: earnings?.date,
        earningsEps: earnings?.eps,
        earningsEpsEstimated: earnings?.epsEstimated,
        earningsTime: earnings?.time,
        earningsRevenue: earnings?.revenue,
        earningsRevenueEstimated: earnings?.revenueEstimated,
        peersList,
        price: undefined,
        volAvg: undefined,
        lastDiv: undefined,
        changes: undefined,
        phone: undefined,
        ipoDate: undefined,
        defaultImage: undefined,
        isAdr: undefined,
        targetHigh: undefined,
        targetLow: undefined,
        targetConsensus: undefined,
        targetMedian: undefined,
      },
    };
  });

  try {
    const results = await db.$transaction(
      upsertData.map((data) =>
        db.stock.upsert({
          select: { id: true },
          ...data,
        }),
      ),
    );
    return results?.length ?? 0;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('updateStocks (transaction_error): error=%s', error.message);
    }
    return 0;
  }
};
