'use server';

import { appConfig } from '@/config/app';
import { getUser } from '@/features/auth/actions/get-user';
import {
  UpdateStocksProps,
  UpdateStocksSchema,
} from '@/features/stock/lib/validators';
import { fmpClient } from '@/lib/axios';
import { db } from '@/lib/db';
import { getEarnings } from '@/lib/fmp/info/get-earnings';
import { getSymbols } from '@/lib/fmp/stock/get-symbols';
import { Earnings } from '@/lib/fmp/types/info';
import { logger } from '@/lib/logger';
import type { Stock } from '@prisma/client';
import { notFound } from 'next/navigation';
import pLimit from 'p-limit';

const { batchSize, concurrencyLimit, mileStone, symbolsPerFetch } =
  appConfig.upload;

interface FlattenedData {
  earnings?: Earnings;
  peersList: string;
  profile: Stock;
}

interface StockPeer {
  peersList: string[];
  symbol: string;
}

/**
 * Uploads descriptive stock data to the database.
 * @param values `UpdateStocksSchema` validator
 * @returns Status message for upload.
 */
export const updateStocks = async (values: UpdateStocksProps) => {
  const { data, error, success } = UpdateStocksSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'updateStocks (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return { error: 'Invalid data.' };
  }

  const user = await getUser();

  if (!user) {
    logger.debug('updateStocks (unauthorized)');
    return notFound();
  }

  if (user.role !== 'ADMIN') {
    logger.debug('updateStocks (forbidden) userId=%s', user.id);
    return notFound();
  }

  const { testRun } = data;

  const startTime = Date.now();
  const symbols = testRun ? ['AAPL', 'MSFT'] : await getSymbols();
  if (!symbols?.length) {
    logger.error('updateStocks (internal_error): error=Symbol fetch failed.');
    return { error: 'Internal server error.' };
  }

  logger.info('updateStocks (upload_initialized): symbols=%s', symbols.length);

  const symbolBatches = Array.from(
    { length: Math.ceil(symbols.length / symbolsPerFetch) },
    (_, i) => symbols.slice(i * symbolsPerFetch, (i + 1) * symbolsPerFetch),
  );

  const fetchPromises = symbolBatches.map(async (batch, i) => {
    try {
      const batchString = batch.join(',');
      const [{ data: profileData }, { data: peerData }, earnings] =
        await Promise.all([
          fmpClient.get<Stock[] | undefined>(`v3/profile/${batchString}`),
          fmpClient.get<StockPeer[] | undefined>(
            `v4/stock_peers?symbol=${batchString}`,
          ),
          getEarnings(),
        ]);

      const stockPeerMap = new Map<string, string[]>();

      if (peerData) {
        for (const peer of peerData) {
          stockPeerMap.set(peer.symbol, peer.peersList);
        }
      }

      if (!profileData) {
        return [];
      }

      return profileData
        .map((profile) => ({
          earnings: earnings?.find((entry) => entry.symbol === profile.symbol),
          peersList: (stockPeerMap.get(profile.symbol) ?? []).join(','),
          profile,
        }))
        .filter(({ profile }) => profile.website !== '');
    } catch (error) {
      logger.error('updateStocks (parse_error): batchNr=%s error=%s', i, error);
      return [];
    }
  });

  const fetchedData = await Promise.all(fetchPromises);
  const fetchEnd = Date.now() - startTime;
  logger.debug(
    `updateStocks (fetch_done): time=%ss`,
    (fetchEnd / 1000).toFixed(0),
  );

  const flattenedData = fetchedData.flat();

  let uploadedSymbols = 0;
  const limit = pLimit(concurrencyLimit);

  const batchPromises = Array.from(
    { length: Math.ceil(flattenedData.length / batchSize) },
    (_, i) => {
      const batchStart = i * batchSize;
      const batchEnd = Math.min(batchStart + batchSize, flattenedData.length);
      const batch = flattenedData.slice(batchStart, batchEnd);

      return limit(async () => {
        const successfulUploads = await executeTransaction(batch);
        uploadedSymbols += successfulUploads;
        if (uploadedSymbols % mileStone === 0 && uploadedSymbols !== 0) {
          const percentage = Math.round(
            (uploadedSymbols / symbols.length) * 100,
          ).toFixed(0);
          const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(0);
          logger.debug(
            `updateStocks (batch_done): status=${percentage}%, time=${elapsedTime}s`,
          );
        }
      });
    },
  );

  await Promise.all(batchPromises);

  const end = Date.now() - startTime;
  logger.info(
    'updateStocks (done): uploadedSymbols=%s, time=%ss.',
    uploadedSymbols,
    (end / 1000).toFixed(0),
  );

  return { success: 'Stock upload complete.' };
};

const executeTransaction = async (batch: FlattenedData[]) => {
  const upsertData = batch.map(({ earnings, peersList, profile }) => {
    const commonData = {
      ...profile,
      changes: undefined,
      defaultImage: undefined,
      earningsDate: earnings?.date && new Date(earnings.date),
      earningsEps: earnings?.eps,
      earningsEpsEstimated: earnings?.epsEstimated,
      earningsRevenue: earnings?.revenue,
      earningsRevenueEstimated: earnings?.revenueEstimated,
      earningsTime: earnings?.time,
      exchange: undefined,
      ipoDate: undefined,
      isAdr: undefined,
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
  });

  try {
    const results = await db.$transaction(
      upsertData.map((data) =>
        db.stock.upsert({ select: { id: true }, ...data }),
      ),
    );
    return results.length;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('updateStocks (error): error=%s', error.message);
    }
    return 0;
  }
};
