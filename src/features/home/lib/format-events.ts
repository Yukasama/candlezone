import { EconomicEvent } from '@/lib/fmp/types/info';
import { format } from 'date-fns';
import { EarningsData, StockEvent } from '../types/events';

interface Props {
  calendarData?: EconomicEvent[];
  day: Date;
  earningsData?: EarningsData[];
}

export const formatEvents = ({ calendarData, day, earningsData }: Props) => {
  const dateStr = format(day, 'yyyy-MM-dd');

  const earningsForDate = earningsData?.filter(
    ({ earningsDate }) =>
      earningsDate && format(new Date(earningsDate), 'yyyy-MM-dd') === dateStr,
  );

  const earningsEvents =
    earningsForDate?.map((event) => {
      const timeStr = event.earnings?.time === 'bmo' ? '13:00' : '22:00';
      const datetime = new Date(`${dateStr}T${timeStr}:00`);
      return {
        datetime,
        timeStr,
        type: 'earnings' as const,
        ...event,
      };
    }) ?? [];

  const economicEventsForDate =
    calendarData?.filter(
      ({ date, impact }) =>
        impact === 'High' && format(new Date(date), 'yyyy-MM-dd') === dateStr,
    ) ?? [];

  const economicEvents = economicEventsForDate.map((event) => ({
    datetime: new Date(event.date),
    type: 'economic' as const,
    ...event,
  }));

  const combinedEvents: StockEvent[] = [...earningsEvents, ...economicEvents];
  combinedEvents.sort((a, b) => a.datetime.getTime() - b.datetime.getTime());

  const groupedEvents: { events: StockEvent[]; time: string }[] = [];
  let currentTime: string | undefined;

  for (const event of combinedEvents) {
    const timeStr = format(event.datetime, 'HH:mm');
    if (timeStr === currentTime) {
      groupedEvents.at(-1)?.events.push(event);
    } else {
      groupedEvents.push({
        events: [event],
        time: timeStr,
      });
      currentTime = timeStr;
    }
  }

  return groupedEvents;
};
