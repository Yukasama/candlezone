import { fmpClient } from '@/lib/axios';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import type { Financials, Stock } from '@prisma/client';

interface Props {
  stock: Pick<Stock, 'id' | 'symbol' | 'updatedAt'>;
}

const MAX_ENTRIES = 9;

export const updateFinancials = async ({ stock }: Props) => {
  try {
    const stockDb = await db.stock.findUnique({
      select: { financials: { select: { calendarYear: true } } },
      where: { id: stock.id },
    });

    if (!stockDb) {
      return;
    }

    let entries = 0;
    if (stockDb.financials.length === 0) {
      entries = MAX_ENTRIES;
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
      entries = Math.min(Math.max(yearsMissing, 0), MAX_ENTRIES);
    }

    if (entries > 0) {
      const { data: ratios } = await fmpClient.get<Financials[]>(
        `v3/ratios/${stock.symbol}?limit=${String(entries)}`,
      );

      const existingYears = new Set(
        stockDb.financials.map((f) => f.calendarYear),
      );

      const newRatios = ratios
        .filter((ratio) => !existingYears.has(ratio.calendarYear))
        .map((financial) => ({
          ...financial,
          priceBookValueRatio: undefined,
          priceFairValue: undefined,
          priceSalesRatio: undefined,
          priceToOperatingCashFlowsRatio: undefined,
          stockId: stock.id,
        }));

      if (newRatios.length > 0) {
        await db.financials.createMany({ data: newRatios });
        logger.info(
          'updateFinancials (ratios_done): symbol=%s, created=%d',
          stock.symbol,
          newRatios.length,
        );
      }
    } else {
      logger.debug(
        'updateFinancials (ratios_skipped): symbol=%s',
        stock.symbol,
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        'updateFinancials (ratios_error): symbol=%s, error=%s',
        stock.symbol,
        error.message,
      );
    }
  }
};
