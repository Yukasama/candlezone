import { db } from '@/lib/db';
import { unstable_cache } from '@/lib/utils/unstable-cache';
import { addDays, endOfDay, startOfDay } from 'date-fns';

export const getCurrentEarnings = unstable_cache(
  async ({ monday, take = 100 }: { monday: Date; take?: number }) => {
    const mondayStart = startOfDay(monday);
    const fridayEnd = endOfDay(addDays(monday, 4));

    return db.stock.findMany({
      orderBy: { marketCap: 'desc' },
      select: {
        companyName: true,
        earningsDate: true,
        earningsEps: true,
        earningsEpsEstimated: true,
        earningsRevenue: true,
        earningsRevenueEstimated: true,
        earningsTime: true,
        image: true,
        marketCap: true,
        symbol: true,
      },
      take: take,
      where: {
        country: 'US',
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
      },
    });
  },
  () => ['getCurrentEarnings'],
  { revalidate: 60 * 60 * 12 },
);
