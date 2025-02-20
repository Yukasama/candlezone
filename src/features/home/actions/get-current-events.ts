import { getCurrentEarnings } from '@/features/earnings/lib/queries';
import { formatEvents } from '@/features/home/lib/format-events';
import { getPortfolioPositionsByUser } from '@/features/portfolio/lib/queries';
import { getEconomicCalendar } from '@/lib/fmp/info/get-economic-calendar';
import { logger } from '@/lib/logger';

export const getCurrentEvents = async () => {
  try {
    const [portfolios, earningsData, calendarData] = await Promise.all([
      getPortfolioPositionsByUser(),
      getCurrentEarnings({ monday: new Date() }),
      getEconomicCalendar(),
    ]);

    logger.debug(
      'getCurrentEvents (raw): earnings=%d calendar=%d',
      earningsData.length,
      calendarData?.length ?? 0,
    );

    const events = formatEvents({ calendarData, earningsData });
    logger.debug('getCurrentEvents (done): events=%d', events.length);

    return { events, portfolios };
  } catch (error) {
    if (error instanceof Error) {
      logger.debug('getCurrentEvents (error) error=%s', error.message);
    } else {
      logger.debug('getCurrentEvents (error) error=%s', error);
    }
    return { events: [], portfolios: [] };
  }
};
