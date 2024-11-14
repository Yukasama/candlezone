import { db } from '@/lib/db';
import { unstable_cache } from '@/lib/utils/unstable-cache';
import { addDays, endOfDay, startOfDay } from 'date-fns';

export const getCurrentEarnings = unstable_cache(
  async ({ monday, take = 100 }: { monday: Date; take?: number }) => {
    const mondayStart = startOfDay(monday).toISOString();
    const fridayEnd = endOfDay(addDays(monday, 4)).toISOString();

    return db.stock.findMany({
      select: {
        symbol: true,
        companyName: true,
        image: true,
        mktCap: true,
        earningsDate: true,
        earningsEpsEstimated: true,
        earningsTime: true,
        earningsRevenue: true,
        earningsRevenueEstimated: true,
        earningsEps: true,
      },
      where: {
        earningsDate: {
          gte: mondayStart,
          lte: fridayEnd,
        },
        symbol: {
          not: {
            contains: '.DE',
            equals: 'GOOGL',
          },
        },
        country: 'US',
      },
      orderBy: { mktCap: 'desc' },
      take: take,
    });
  },
  () => ['getCurrentEarnings'],
  {
    revalidate: 60 * 60 * 12,
  },
);
