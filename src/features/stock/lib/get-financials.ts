import { db } from '@/lib/db';
import { unstable_cache } from '@/lib/utils/unstable-cache';

export const getFinancials = unstable_cache(
  async ({ stockId }: { stockId: string }) => {
    return await db.financials.findMany({
      select: {
        priceEarningsRatio: true,
        priceToSalesRatio: true,
        priceToBookRatio: true,
        priceEarningsToGrowthRatio: true,
        grossProfitMargin: true,
        operatingProfitMargin: true,
        netProfitMargin: true,
        dividendYield: true,
      },
      where: {
        stockId,
        date: { gte: '2015-01-01' },
      },
      orderBy: { date: 'desc' },
      take: 8,
    });
  },
  ({ stockId }: { stockId: string }) => ['getFinancials' + stockId],
  { revalidate: 60 * 60 * 24 * 30 },
);
