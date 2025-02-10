import { fmpClient } from '@/lib/axios';
import { db } from '@/lib/db';
import { getCompanyOutlook } from '@/lib/fmp/stock/get-company-outlook';
import { logger } from '@/lib/logger';
import type { Financials, Stock } from '@prisma/client';

interface Props {
  stock: Pick<Stock, 'id' | 'symbol' | 'updatedAt'>;
  stockData: Awaited<ReturnType<typeof getCompanyOutlook>>;
}

export const updateStock = async ({ stock, stockData }: Props) => {
  const isEightHoursAgo = new Date(Date.now() - 1000 * 60 * 60 * 8);
  if (stock.updatedAt <= isEightHoursAgo) {
    logger.debug('updateStock (skipped): symbol=%s', stock.symbol);
    return;
  }

  if (!stockData) {
    return;
  }

  try {
    const { profile, ratios: ratiosTTM } = stockData;

    const stockInsert = {
      ...profile,
      ...ratiosTTM,
      changes: undefined,
      defaultImage: undefined,
      dividendYieldTTM: undefined,
      exchange: undefined,
      ipoDate: undefined,
      isAdr: undefined,
      lastDiv: undefined,
      phone: undefined,
      price: undefined,
      priceBookValueRatioTTM: undefined,
      priceFairValueTTM: undefined,
      priceSalesRatioTTM: undefined,
      priceToOperatingCashFlowsRatioTTM: undefined,
      volAvg: undefined,
    };

    await db.stock.upsert({
      create: stockInsert,
      update: stockInsert,
      where: { symbol: profile.symbol.toUpperCase() },
    });
    logger.debug('updateStock (ratiosTTM_done): symbol=%s', stock.symbol);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        'updateStock (ratiosTTM_error): symbol=%s, error=%s',
        stock.symbol,
        error.message,
      );
    }
  }

  try {
    const stockDb = await db.stock.findUnique({
      select: { financials: true },
      where: { id: stock.id },
    });

    if (!stockDb) {
      return;
    }

    const maxEntries = 9;
    let entries = 0;

    if (stockDb.financials.length === 0) {
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
        `v3/ratios/${stock.symbol}?limit=${String(entries)}`,
      );

      const ratiosUpserts = ratios.map((financial) => {
        const ratioData = {
          ...financial,
          priceBookValueRatio: undefined,
          priceFairValue: undefined,
          priceSalesRatio: undefined,
          priceToOperatingCashFlowsRatio: undefined,
          stockId: stock.id,
        };

        return db.financials.upsert({
          create: ratioData,
          update: ratioData,
          where: {
            stockId_calendarYear: {
              calendarYear: financial.calendarYear,
              stockId: stock.id,
            },
          },
        });
      });

      await db.$transaction(ratiosUpserts);
      logger.info('updateStock (ratios_done): symbol=%s', stock.symbol);
    } else {
      logger.debug('updateStock (ratios_skipped): symbol=%s', stock.symbol);
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        'updateStock (ratios_error): symbol=%s, error=%s',
        stock.symbol,
        error.message,
      );
    }
  }
};
