import { db } from '@/lib/db';
import { unstable_cache } from '@/lib/utils/unstable-cache';
import type { Stock } from '@prisma/client';

interface Props {
  stock: Pick<Stock, 'id' | 'symbol' | 'updatedAt'>;
}

export const getFinancials = unstable_cache(
  async ({ stock }: Props) => {
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
        stockId: stock.id,
      },
    });
  },
  ({ stock }: Props) => [`getFinancials${String(stock.id)}`],
  { revalidate: 60 * 60 * 24 * 30 },
);
