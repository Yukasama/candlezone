'use server';

import { getCurrentEarnings } from '@/features/earnings/lib/queries';
import { formatEvents } from '@/features/home/lib/format-events';
import { getPortfolioPositionsByUser } from '@/features/portfolio/lib/queries';
import { getEconomicCalendar } from '@/lib/fmp/info/get-economic-calendar';
import { getCurrentWeek } from '@/lib/utils/date-helpers';

export const getCurrentEvents = async () => {
  const { weekStart } = getCurrentWeek();

  const [portfolios, earningsData, calendarData] = await Promise.all([
    getPortfolioPositionsByUser(),
    getCurrentEarnings({ monday: weekStart }),
    getEconomicCalendar(),
  ]);

  const events = formatEvents({ calendarData, day: weekStart, earningsData });

  return { events, portfolios };
};
