import { CurrentEarningsItem } from '@/features/earnings/types/earnings';
import { EconomicCalendarItem } from '@/lib/fmp/types/info';
import { format } from 'date-fns';
import { StockEvent } from '../types/events';

interface Props {
  calendarData?: EconomicCalendarItem[];
  day?: Date;
  earningsData?: CurrentEarningsItem[];
}

export const formatEvents = ({
  calendarData,
  day = new Date(),
  earningsData,
}: Props) => {
  const today = format(day, 'yyyy-MM-dd');
  const groupedEvents = new Map<string, StockEvent>();

  if (earningsData) {
    const filteredEarnings = earningsData.filter(
      ({ earningsDate }) =>
        earningsDate && format(new Date(earningsDate), 'yyyy-MM-dd') === today,
    );

    for (const event of filteredEarnings) {
      const timeStr = event.earnings?.time === 'bmo' ? '13:00' : '22:00';
      const datetime = new Date(`${today}T${timeStr}:00`);
      const key = format(datetime, 'HH:mm');

      if (!groupedEvents.has(key)) {
        groupedEvents.set(key, {
          datetime,
          events: [],
          type: 'earnings',
        });
      }

      const group = groupedEvents.get(key);
      if (group) {
        group.events.push({
          ...event,
          type: 'earnings',
        });
      }
    }
  }

  if (calendarData) {
    const filteredCalendar = calendarData.filter(
      ({ date, impact }) =>
        impact === 'High' && format(new Date(date), 'yyyy-MM-dd') === today,
    );

    for (const event of filteredCalendar) {
      const datetime = new Date(event.date);
      const key = format(datetime, 'HH:mm');

      if (!groupedEvents.has(key)) {
        groupedEvents.set(key, {
          datetime,
          events: [],
          type: 'economic',
        });
      }

      const group = groupedEvents.get(key);
      if (group) {
        group.events.push({
          ...event,
          type: 'economic',
        });
      }
    }
  }

  return [...groupedEvents.values()].sort(
    (a, b) => a.datetime.getTime() - b.datetime.getTime(),
  );
};
