import { CurrentEarnings } from '@/features/earnings/types/earnings';
import { EconomicCalendarItem } from '@/lib/fmp/types/info';
import { addDays, format, subDays } from 'date-fns';
import { EventsByDay, EventWithType } from '../types/events';
import { formatEventDay } from './format-event-day';

export const formatEvents = ({
  calendarData,
  day = new Date(),
  earningsData,
}: {
  calendarData?: EconomicCalendarItem[];
  day?: Date;
  earningsData: CurrentEarnings;
}): EventsByDay => {
  const today = new Date(day);
  today.setHours(0, 0, 0, 0);

  const todayStr = format(today, 'yyyy-MM-dd');
  const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');
  const tomorrowStr = format(addDays(today, 1), 'yyyy-MM-dd');

  const rawEvents: Record<string, Record<string, EventWithType[]>> = {
    [todayStr]: {},
    [tomorrowStr]: {},
    [yesterdayStr]: {},
  };

  if (earningsData.length > 0) {
    for (const event of earningsData) {
      if (!event.earningsDate) {
        continue;
      }

      const earningsDate = format(new Date(event.earningsDate), 'yyyy-MM-dd');
      const time = event.earnings[0]?.time === 'BMO' ? '13:00' : '22:00';
      const timeKey = `${earningsDate}T${time}`;

      if (!(timeKey in rawEvents[earningsDate])) {
        rawEvents[earningsDate][timeKey] = [];
      }

      rawEvents[earningsDate][timeKey].push({ ...event, type: 'earnings' });
    }
  }

  if (calendarData && calendarData.length > 0) {
    const filteredCalendar = calendarData.filter(
      ({ impact }) => impact === 'High',
    );

    for (const event of filteredCalendar) {
      const eventDate = new Date(event.date);
      const dateStr = format(eventDate, 'yyyy-MM-dd');
      if (![todayStr, tomorrowStr, yesterdayStr].includes(dateStr)) {
        continue;
      }

      const timeKey = format(eventDate, "yyyy-MM-dd'T'HH:mm");
      if (!(timeKey in rawEvents[dateStr])) {
        rawEvents[dateStr][timeKey] = [];
      }

      rawEvents[dateStr][timeKey].push({ ...event, type: 'economic' });
    }
  }

  const result: EventsByDay = { today: [], tomorrow: [], yesterday: [] };

  formatEventDay(yesterdayStr, 'yesterday', rawEvents, result);
  formatEventDay(todayStr, 'today', rawEvents, result);
  formatEventDay(tomorrowStr, 'tomorrow', rawEvents, result);

  return result;
};
