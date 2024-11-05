import { fmpClient } from '@/lib/axios';
import { db } from '@/lib/db';
import { getCompanyOutlook } from '@/lib/fmp/stock/get-company-outlook';
import { logger } from '@/lib/logger';
import { Financials, Stock } from '@prisma/client';

interface Props {
  stock: Pick<Stock, 'id' | 'updatedAt'>;
  stockData: Awaited<ReturnType<typeof getCompanyOutlook>>;
}

export const updateStock = async ({ stock, stockData }: Props) => {
  const twelveHoursAgo = new Date(Date.now() - 1000 * 60 * 60 * 8);
  if (stock.updatedAt > twelveHoursAgo) {
    return;
  }

  if (!stockData) {
    return;
  }

  const { profile, ratios: ratiosTTM } = stockData;

  try {
    const stockInsert = {
      ...profile,
      ...ratiosTTM,
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

    await db.stock.upsert({
      where: { symbol: profile.symbol.toUpperCase() },
      update: stockInsert,
      create: stockInsert,
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        'updateStock (ratiosTTM_error): symbol=%s, error=%s',
        profile.symbol,
        error.message,
      );
    }
  }

  try {
    const stockDb = await db.stock.findFirst({
      select: { financials: true },
      where: { id: stock.id },
    });

    if (!stockDb) {
      return;
    }

    const maxEntries = 25;
    let entries = 0;

    if (!stockDb.financials || stockDb.financials.length === 0) {
      entries = maxEntries;
    } else {
      const financialYears = stockDb.financials
        .map((f) => Number.parseInt(f.calendarYear, 10))
        .filter((year) => !Number.isNaN(year));

      const lastFinancialYear = Math.max(...financialYears);

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const isAfterSeptember30 = currentDate >= new Date(currentYear, 8, 30);

      const latestYear = isAfterSeptember30 ? currentYear : currentYear - 1;
      const yearsMissing = latestYear - lastFinancialYear;
      entries = Math.min(Math.max(yearsMissing, 0), maxEntries);
    }

    if (entries > 0) {
      const { data: ratios } = await fmpClient.get<Financials[]>(
        `v3/ratios/${profile.symbol}?limit=${entries}`,
      );

      const ratiosUpserts = ratios.map((financial) => {
        const ratioData = {
          ...financial,
          stockId: stock.id,
          priceBookValueRatio: undefined,
          priceToOperatingCashFlowsRatio: undefined,
          priceSalesRatio: undefined,
          priceFairValue: undefined,
        };

        return db.financials.upsert({
          where: {
            stockId_calendarYear: {
              stockId: stock.id,
              calendarYear: financial.calendarYear,
            },
          },
          update: ratioData,
          create: ratioData,
        });
      });

      await db.$transaction(ratiosUpserts);
    }

    logger.info('updateStock (done): symbol=%s', profile.symbol);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        'updateStock (ratios_error): symbol=%s, error=%s',
        profile.symbol,
        error.message,
      );
    }
  }
};
