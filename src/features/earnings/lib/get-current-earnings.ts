import { db } from '@/lib/db';
import {
  addBusinessDays,
  endOfDay,
  startOfDay,
  subBusinessDays,
} from 'date-fns';
import { unstable_cacheLife as cacheLife } from 'next/cache';

export const getCurrentEarnings = async () => {
  'use cache';
  cacheLife('hours');

  const today = new Date();
  const lastTradingDay = startOfDay(subBusinessDays(today, 1));
  const tomorrow = endOfDay(addBusinessDays(today, 1));

  return await db.stock.findMany({
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
    where: {
      country: 'US',
      earningsDate: { gte: lastTradingDay, lte: tomorrow },
      symbol: { not: { contains: '.DE', equals: 'GOOGL' } },
    },
  });
};
