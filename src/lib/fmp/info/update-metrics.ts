import { appConfig } from '@/config/app';
import { env } from '@/env.mjs';
import { StockWithFinancials } from '@/features/stock/types/stock';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { Financials, Stock } from '@prisma/client';

type TempStock = Partial<Stock> & { 'Error Message': string };

export const updateMetrics = async (stockDb: StockWithFinancials) => {
  const entries = stockDb.financials.length === 0 ? 120 : 1;
  const [ratiosTTM, ratios] = await Promise.all([
    fetch(
      `${appConfig.fmp.url}v3/ratios-ttm/${stockDb.symbol}?apikey=${env.FMP_API_KEY}`,
      { cache: 'no-store' },
    ),
    fetch(
      `${appConfig.fmp.url}v3/ratios/${stockDb.symbol}?limit=${entries}&apikey=${env.FMP_API_KEY}`,
      { cache: 'no-store' },
    ),
  ]);

  if (!ratiosTTM.ok || !ratios.ok) {
    logger.info('getStockRatios (fetch_failed): symbol=%s', stockDb.symbol);
    return stockDb;
  }

  const ratiosTTMData = (await ratiosTTM.json()) as TempStock[];
  const ratiosData = (await ratios.json()) as Financials[];

  const stock = {
    symbol: stockDb.symbol,
    companyName: stockDb.companyName,
    image: stockDb.image,
    ...ratiosTTMData[0],
    price: undefined,
    volAvg: undefined,
    lastDiv: undefined,
    changes: undefined,
    phone: undefined,
    ipoDate: undefined,
    defaultImage: undefined,
    isAdr: undefined,
    priceBookValueRatioTTM: undefined,
    priceToOperatingCashFlowsRatioTTM: undefined,
    priceSalesRatioTTM: undefined,
    priceFairValueTTM: undefined,
    dividendYieldTTM: undefined,
    targetHigh: undefined,
    targetLow: undefined,
    targetConsensus: undefined,
    targetMedian: undefined,
  };

  const ratiosTTMUpsert = db.stock.upsert({
    where: { symbol: stockDb.symbol.toUpperCase() },
    update: stock,
    create: stock,
  });

  const ratiosUpsert = ratiosData.map((financial: Financials) => ({
    ...financial,
    stockId: stockDb.id,
    priceBookValueRatio: undefined,
    priceToOperatingCashFlowsRatio: undefined,
    priceSalesRatio: undefined,
    priceFairValue: undefined,
  }));

  const financialInserts =
    entries === 1
      ? db.financials.upsert({
          where: {
            stockId_calendarYear: {
              stockId: stockDb.id,
              calendarYear: ratiosUpsert[0].calendarYear,
            },
          },
          update: ratiosUpsert[0],
          create: ratiosUpsert[0],
        })
      : db.financials.createMany({
          data: ratiosUpsert,
        });

  const upsert = await db.$transaction([ratiosTTMUpsert, financialInserts]);
  logger.info('getStockRatios (data_refresh): symbol=%s', upsert[0].symbol);

  return {
    ...upsert[0],
    financials: ratiosUpsert,
  };
};
