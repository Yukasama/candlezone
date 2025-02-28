import { db } from '@/lib/db';
import { unstable_cache } from '@/lib/utils/unstable-cache';
import { addDays, endOfDay, startOfDay } from 'date-fns';

export const getWeeklyEarnings = unstable_cache(
  async ({ monday, take = 100 }: { monday: Date; take?: number }) => {
    const mondayStart = startOfDay(monday);
    const fridayEnd = endOfDay(addDays(monday, 4));

    const stocks = await db.stock.findMany({
      orderBy: { marketCap: 'desc' },
      select: {
        companyName: true,
        earnings: {
          orderBy: { date: 'desc' },
          select: {
            date: true,
            epsActual: true,
            epsEstimated: true,
            revenueActual: true,
            revenueEstimated: true,
            time: true,
          },
          take: 1,
        },
        earningsDate: true,
        id: true,
        image: true,
        marketCap: true,
        range: true,
        sector: true,
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

    return stocks.map((stock) => ({
      ...stock,
      earnings: stock.earnings.at(0),
    }));
  },
  () => ['getWeeklyEarnings'],
  { revalidate: 60 * 60 * 12 },
);
