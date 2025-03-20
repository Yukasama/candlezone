import { db } from '@/lib/db';
import type { Stock } from '@prisma/client';
import { unstable_cacheLife as cacheLife } from 'next/cache';

interface Props {
  stock: Pick<Stock, 'id' | 'symbol' | 'updatedAt'>;
}

export const getFinancials = async ({ stock }: Props) => {
  'use cache';
  cacheLife('weeks');

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
};
