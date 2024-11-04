import { StockWithFinancials } from '@/features/stock/types/stock';
import { fmpClient } from '@/lib/axios';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { Financials, Stock } from '@prisma/client';

type TempStock = Partial<Stock> & { 'Error Message': string };

export const updateMetrics = async (stockDb: StockWithFinancials) => {
  const entries = stockDb.financials.length === 0 ? 120 : 1;

  try {
    const symbol = stockDb.symbol;
    const [{ data: ratiosTTM }, { data: ratios }] = await Promise.all([
      fmpClient.get<TempStock[]>(`v3/ratios-ttm/${symbol}`),
      fmpClient.get<Financials[]>(`v3/ratios/${symbol}?limit=${entries}`),
    ]);

    const stock = {
      symbol,
      companyName: stockDb.companyName,
      image: stockDb.image,
      ...ratiosTTM[0],
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
      where: { symbol: symbol.toUpperCase() },
      update: stock,
      create: stock,
    });

    const ratiosUpsert = ratios.map((financial: Financials) => ({
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
        : db.financials.createMany({ data: ratiosUpsert });

    const upsert = await db.$transaction([ratiosTTMUpsert, financialInserts]);
    logger.info('getStockRatios (data_refresh): symbol=%s', upsert[0].symbol);

    return { ...upsert[0], financials: ratiosUpsert };
  } catch {
    logger.info('getStockRatios (fetch_failed): symbol=%s', stockDb.symbol);
    return stockDb;
  }
};
