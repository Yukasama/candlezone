import { getCurrentEarnings } from '@/features/earnings/lib/queries';
import { EconomicEvent } from '@/lib/fmp/types/info';
import { format } from 'date-fns';

type EarningsData = Awaited<ReturnType<typeof getCurrentEarnings>>[number];

export interface EarningsEvent extends EarningsData {
  type: 'earnings';
  timeStr: string;
  datetime: Date;
}

export interface EconomicEventExtended extends EconomicEvent {
  type: 'economic';
  datetime: Date;
}

type Event = EarningsEvent | EconomicEventExtended;

interface Props {
  day: Date;
  earningsData?: EarningsData[];
  calendarData?: EconomicEvent[];
}

export const formatEvents = ({ day, earningsData, calendarData }: Props) => {
  const dateStr = format(day, 'yyyy-MM-dd');

  const earningsForDate = earningsData?.filter(
    ({ earningsDate }) =>
      earningsDate && format(new Date(earningsDate), 'yyyy-MM-dd') === dateStr,
  );

  const earningsEvents =
    earningsForDate?.map((event) => {
      const timeStr = event.earningsTime === 'bmo' ? '13:00' : '22:00';
      const datetime = new Date(`${dateStr}T${timeStr}:00`);
      return {
        type: 'earnings' as const,
        datetime,
        timeStr,
        ...event,
      };
    }) ?? [];

  const economicEventsForDate =
    calendarData?.filter(
      ({ impact, date }) =>
        impact === 'High' && format(new Date(date), 'yyyy-MM-dd') === dateStr,
    ) ?? [];

  const economicEvents = economicEventsForDate.map((event) => ({
    type: 'economic' as const,
    datetime: new Date(event.date),
    ...event,
  }));

  const combinedEvents: Event[] = [...earningsEvents, ...economicEvents];

  combinedEvents.sort((a, b) => a.datetime.getTime() - b.datetime.getTime());

  const groupedEvents: { time: string; events: Event[] }[] = [];
  let currentTime: string | undefined;

  for (const event of combinedEvents) {
    const timeStr = format(event.datetime, 'HH:mm');
    if (timeStr === currentTime) {
      groupedEvents[groupedEvents.length - 1].events.push(event);
    } else {
      groupedEvents.push({
        time: timeStr,
        events: [event],
      });
      currentTime = timeStr;
    }
  }

  return groupedEvents;
};
