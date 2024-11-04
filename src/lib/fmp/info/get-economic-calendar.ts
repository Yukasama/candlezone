import { fmpClient } from '@/lib/axios';
import { EconomicEvent } from '@/lib/fmp/types/info';
import { logger } from '@/lib/logger';
import { formatDate } from '@/lib/utils/date-helpers';
import { addDays, startOfWeek } from 'date-fns';

export const getEconomicCalendar = async () => {
  try {
    const today = new Date();
    const isWeekend = today.getDay() === 6 || today.getDay() === 0;

    const startOfWeekDate = isWeekend
      ? addDays(startOfWeek(today, { weekStartsOn: 1 }), 7)
      : startOfWeek(today, { weekStartsOn: 1 });
    const endOfWeekDate = addDays(startOfWeekDate, 4);

    const { data } = await fmpClient.get<EconomicEvent[]>(
      `v3/economic_calendar?from=${formatDate(startOfWeekDate)}&to=${formatDate(endOfWeekDate)}`,
    );

    return data;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('getEconomicCalendar (error): %s', error.message);
    }
  }
};
