'use server';

import { fmpNewClient } from '@/lib/axios';
import { db } from '@/lib/db';
import { createEarnings } from '@/lib/fmp/earnings-factory';
import { getEarnings } from '@/lib/fmp/info/get-earnings';
import { createStock } from '@/lib/fmp/stock-factory';
import { logger } from '@/lib/logger';
import { isStockValid } from '@/lib/utils/stock-helper';
import type { Prisma, Stock } from '@prisma/client';
import { chunkArray, parseData } from '../lib/parse-data';
import { StockDCF, StockPeer } from '../types/upload';

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
    earnings: earnings?.filter((e) => e.symbol === profile.symbol) ?? [],
    earningsDate: earnings?.find((e) => e.symbol === profile.symbol)?.date,
    peersList: parsedPeers.find((p) => p.symbol === profile.symbol)?.peers,
    profile,
    ratiosTTM: ratioMap.get(profile.symbol),
  }));

  const fetchEnd = Date.now() - startTime;
  logger.debug(
    `updateStocks (fetch_done): time=%ss`,
    (fetchEnd / 1000).toFixed(1),
  );

  const existingStocks = await db.stock.findMany({
    select: { id: true, symbol: true, updatedAt: true },
  });

  const existingStockMap = new Map(
    existingStocks.map(({ symbol }) => [symbol, stock]),
  );
  const updates: Prisma.StockUpdateInput & { id: number }[] = [];
  const inserts: Prisma.StockCreateInput[] = [];
  const earningsData: (Prisma.EarningsCreateInput & { stockId: number })[] = [];

  for (const stock of stocks) {
    const existing = existingStockMap.get(stock.profile.symbol);
    const commonData = createStock(stock);

    if (existing) {
      const diff = Date.now() - existing.updatedAt.getTime();
      if (diff < 6 * 60 * 60 * 1000) {
        continue;
      }

      updates.push({
        ...commonData,
        id: existing.id,
      });

      if (stock.earnings.length > 0) {
        for (const earning of stock.earnings) {
          earningsData.push(
            createEarnings({
              earning,
              stockId: existing.id,
            }),
          );
        }
      }
    } else {
      inserts.push(commonData);
    }
  }

  const results = await db.$transaction(async (tx) => {
    let count = 0;

    if (inserts.length > 0) {
      const created = await tx.stock.createMany({
        data: inserts,
      });
      count += created.count;
    }

    if (updates.length > 0) {
      for (const update of updates) {
        const { id, ...data } = update;
        await tx.stock.update({
          data,
          where: { id },
        });
        count++;
      }
    }

    if (earningsData.length > 0) {
      await tx.earnings.createMany({
        data: earningsData,
      });
    }

    return count;
  });

  logger.info(
    'uploadStocks (done): processed=%s, time=%ss.',
    results,
    ((Date.now() - startTime) / 1000).toFixed(1),
  );

  return { success: 'Stock upload complete.' };
};
