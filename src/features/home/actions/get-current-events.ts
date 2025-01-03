'use server';

import { getUser } from '@/features/auth/actions/get-user';
import { getCurrentEarnings } from '@/features/earnings/lib/queries';
import { formatEvents } from '@/features/home/lib/format-events';
import { getPortfolioPositionsByUser } from '@/features/portfolio/lib/queries';
import { getEconomicCalendar } from '@/lib/fmp/info/get-economic-calendar';
import { getCurrentWeek } from '@/lib/utils/date-helpers';

export const getCurrentEvents = async () => {
  const { weekStart } = getCurrentWeek();

  const user = await getUser();
  const [portfolios, earningsData, calendarData] = await Promise.all([
    user ? getPortfolioPositionsByUser({ userId: user.id }) : undefined,
    getCurrentEarnings({ monday: weekStart }),
    getEconomicCalendar(),
  ]);

  const events = formatEvents({ day: weekStart, earningsData, calendarData });

  return { portfolios, events };
};
