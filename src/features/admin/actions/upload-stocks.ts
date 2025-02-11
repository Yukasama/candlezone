'use server';

import { appConfig } from '@/config/app';
import { fmpNewClient } from '@/lib/axios';
import { getEarnings } from '@/lib/fmp/info/get-earnings';
import { logger } from '@/lib/logger';
import { isStockValid } from '@/lib/utils/stock-helper';
import type { Stock } from '@prisma/client';
import { parseData } from '../lib/parse-data';
import { StockDCF } from '../types/dcf';

const { batchSize, concurrencyLimit, mileStone } = appConfig.upload;

const chunkArray = <T>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

interface StockPeer {
  peers: string;
  symbol: string;
}

/**
 * Uploads descriptive stock data to the database.
 * Splits large data sets (like ratiosTTM) into smaller chunks
 * to avoid hitting memory constraints.
 */
export const uploadStocks = async () => {
  const startTime = Date.now();

  const [
    { data: profileData0 },
    // { data: profileData1 },
    // { data: profileData2 },
    // { data: profileData3 },
    { data: peerData },
    { data: dcfData },
    { data: ratiosTTMData },
    earnings,
  ] = await Promise.all([
    fmpNewClient.get<string>('profile-bulk?part=0'),
    // fmpNewClient.get<string>('profile-bulk?part=1'),
    // fmpNewClient.get<string>('profile-bulk?part=2'),
    // fmpNewClient.get<string>('profile-bulk?part=3'),
    fmpNewClient.get<string>('peers-bulk'),
    fmpNewClient.get<string>('dcf-bulk'),
    fmpNewClient.get<string>('ratios-ttm-bulk'),
    getEarnings(),
  ]);

  const profiles0 = parseData<Stock>(profileData0);
  // const profiles1 = parseData<Stock>(profileData1);
  // const profiles2 = parseData<Stock>(profileData2);
  // const profiles3 = parseData<Stock>(profileData3);
  // , ...profiles1, ...profiles2, ...profiles3
  const allProfiles = [...profiles0];

  const parsedPeers = parseData<StockPeer>(peerData);
  const parsedDCF = parseData<StockDCF>(dcfData);
  const rawRatiosTTM = parseData<Stock>(ratiosTTMData);
  const ratioChunks = chunkArray(rawRatiosTTM, 5000);

  const ratioMap = new Map<string, Stock>();
  for (const chunk of ratioChunks) {
    for (const ratioItem of chunk) {
      ratioMap.set(ratioItem.symbol, ratioItem);
    }
  }

  const validProfiles = allProfiles.filter((stock) => isStockValid(stock));
  const stocks = validProfiles.map((profile) => ({
    dcf: parsedDCF.find((d) => d.symbol === profile.symbol),
    earnings: earnings?.find((e) => e.symbol === profile.symbol),
    earningsDate: earnings?.find((e) => e.symbol === profile.symbol)?.date,
    peersList: parsedPeers.find((p) => p.symbol === profile.symbol)?.peers,
    profile,
    ratiosTTM: ratioMap.get(profile.symbol),
  }));

  console.log(stocks);

  const fetchEnd = Date.now() - startTime;
  logger.debug(
    `updateStocks (fetch_done): time=%ss`,
    (fetchEnd / 1000).toFixed(1),
  );

  // let uploadedSymbols = 0;
  // const limit = pLimit(concurrencyLimit);

  // const batchPromises = Array.from(
  //   { length: Math.ceil(stocks.length / batchSize) },
  //   (_, i) => {
  //     const batchStart = i * batchSize;
  //     const batchEnd = Math.min(batchStart + batchSize, stocks.length);
  //     const batch = stocks.slice(batchStart, batchEnd);

  //     return limit(async () => {
  //       const successfulUploads = await executeTransaction(batch);
  //       uploadedSymbols += successfulUploads;
  //       if (uploadedSymbols % mileStone === 0 && uploadedSymbols !== 0) {
  //         const percentage = Math.round(
  //           (uploadedSymbols / stocks.length) * 100,
  //         ).toFixed(0);
  //         const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(0);
  //         logger.debug(
  //           `updateStocks (batch_done): status=${percentage}%, time=${elapsedTime}s`,
  //         );
  //       }
  //     });
  //   },
  // );

  // await Promise.all(batchPromises);

  // const end = Date.now() - startTime;
  // logger.info(
  //   'updateStocks (done): uploadedSymbols=%s, time=%ss.',
  //   uploadedSymbols,
  //   (end / 1000).toFixed(1),
  // );

  return { success: 'Stock upload complete.' };
};
