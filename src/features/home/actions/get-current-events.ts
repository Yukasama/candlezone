import { getCurrentEarnings } from '@/features/earnings/lib/get-current-earnings';
import { formatEvents } from '@/features/home/lib/format-events';
import { getPortfolioPositionsByUser } from '@/features/portfolio/lib/queries';
import { getEconomicCalendar } from '@/lib/fmp/info/get-economic-calendar';
import { logger } from '@/lib/logger';

export const getCurrentEvents = async () => {
  try {
    const [portfolios, earningsData, calendarData] = await Promise.all([
      getPortfolioPositionsByUser(),
      getCurrentEarnings(),
      getEconomicCalendar(),
    ]);

    logger.debug(
      'getCurrentEvents (raw): earnings=%d, calendar=%d',
      earningsData.length,
      calendarData?.length ?? 0,
    );

    const events = formatEvents({ calendarData, earningsData });
    logger.debug('getCurrentEvents (done): events=%o', events);

    return { events, portfolios };
  } catch (error) {
    logger.debug(
      'getCurrentEvents (error): %s',
      error instanceof Error ? error.message : String(error),
    );
  }
};
