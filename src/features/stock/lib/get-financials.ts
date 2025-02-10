import { db } from '@/lib/db';
import { unstable_cache } from '@/lib/utils/unstable-cache';

export const getFinancials = unstable_cache(
  async ({ stockId }: { stockId: string }) => {
    return await db.financials.findMany({
      orderBy: { date: 'desc' },
      select: {
        dividendYield: true,
        grossProfitMargin: true,
        netProfitMargin: true,
        operatingProfitMargin: true,
        priceEarningsRatio: true,
        priceEarningsToGrowthRatio: true,
        priceToBookRatio: true,
        priceToSalesRatio: true,
      },
      take: 8,
      where: {
        date: { gte: '2015-01-01' },
        stockId,
      },
    });
  },
  ({ stockId }: { stockId: string }) => ['getFinancials' + stockId],
  { revalidate: 60 * 60 * 24 * 30 },
);
