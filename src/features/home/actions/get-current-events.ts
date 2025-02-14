'use server';

import { getCurrentEarnings } from '@/features/earnings/lib/queries';
import { formatEvents } from '@/features/home/lib/format-events';
import { getPortfolioPositionsByUser } from '@/features/portfolio/lib/queries';
import { getEconomicCalendar } from '@/lib/fmp/info/get-economic-calendar';
import { logger } from '@/lib/logger';
import { getCurrentWeek } from '@/lib/utils/date-helpers';

export const getCurrentEvents = async () => {
  try {
    const { weekStart } = getCurrentWeek();

    const [portfolios, earningsData, calendarData] = await Promise.all([
      getPortfolioPositionsByUser(),
      getCurrentEarnings({ monday: weekStart }),
      getEconomicCalendar(),
    ]);

    const events = formatEvents({ calendarData, day: weekStart, earningsData });

    return { events, portfolios };
  } catch (error) {
    if (error instanceof Error) {
      logger.debug('getCurrentEvents (error) error=%s', error.message);
    } else {
      logger.debug('getCurrentEvents (error) error=%s', error);
    }
  }
};
