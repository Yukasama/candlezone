import { db } from '@/lib/db';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { unstable_cacheLife as cacheLife } from 'next/cache';

export const getWeeklyEarnings = async ({
  monday,
  take = 100,
}: {
  monday: Date;
  take?: number;
}) => {
  'use cache';
  cacheLife('hours');

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
};
