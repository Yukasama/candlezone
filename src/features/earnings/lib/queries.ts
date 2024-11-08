import { db } from '@/lib/db';
import { addDays, endOfDay, startOfDay } from 'date-fns';

export const getCurrentEarnings = async ({ monday }: { monday: Date }) => {
  const mondayStart = startOfDay(monday).toISOString();
  const fridayEnd = endOfDay(addDays(monday, 4)).toISOString();

  return await db.stock.findMany({
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
    orderBy: {
      mktCap: 'desc',
    },
    take: 100,
  });
};
