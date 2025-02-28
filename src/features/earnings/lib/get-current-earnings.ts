import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { unstable_cache } from '@/lib/utils/unstable-cache';
import {
  addBusinessDays,
  endOfDay,
  startOfDay,
  subBusinessDays,
} from 'date-fns';

export const getCurrentEarnings = unstable_cache(
  async () => {
    const today = new Date();
    const lastTradingDay = startOfDay(subBusinessDays(today, 1));
    const tomorrow = endOfDay(addBusinessDays(today, 1));

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
      where: {
        country: 'US',
        earningsDate: {
          gte: lastTradingDay,
          lte: tomorrow,
        },
        symbol: {
          not: {
            contains: '.DE',
            equals: 'GOOGL',
          },
        },
      },
    });

    const groupedEarnings: Record<
      'lastTradingDay' | 'today' | 'tomorrow',
      typeof stocks
    > = {
      lastTradingDay: [],
      today: [],
      tomorrow: [],
    };

    for (const stock of stocks) {
      if (!stock.earningsDate) {
        continue;
      }

      const earningsDate = new Date(stock.earningsDate);
      let dateKey: keyof typeof groupedEarnings;

      if (earningsDate.toDateString() === today.toDateString()) {
        dateKey = 'today';
      } else if (
        earningsDate.toDateString() === lastTradingDay.toDateString()
      ) {
        dateKey = 'lastTradingDay';
      } else {
        dateKey = 'tomorrow';
      }

      groupedEarnings[dateKey].push({
        ...stock,
        earnings: stock.earnings[0] ? [stock.earnings[0]] : [],
      });
    }

    logger.debug(
      'getCurrentEarnings (done): lastTradingDay=%d, today=%d, tomorrow=%d',
      groupedEarnings.lastTradingDay.length,
      groupedEarnings.today.length,
      groupedEarnings.tomorrow.length,
    );

    return groupedEarnings;
  },
  () => ['getCurrentEarnings'],
  { revalidate: 60 * 60 * 4 },
);
