import { getCurrentEarnings } from '@/features/earnings/lib/queries';
import { EconomicEvent } from '@/lib/fmp/types/info';
import { format } from 'date-fns';

type EarningsData = Awaited<ReturnType<typeof getCurrentEarnings>>[0];

interface EarningsEvent extends EarningsData {
  type: 'earnings';
  timeDescription: string;
  timeStr: string;
  datetime: Date;
}

interface EconomicEventExtended extends EconomicEvent {
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

  const earningsEvents = earningsForDate?.map((event) => {
    const timeStr = event.earningsTime === 'bmo' ? '13:00' : '22:00';
    const timeDescription =
      event.earningsTime === 'bmo'
        ? 'Before Market Open'
        : 'After Market Close';
    const datetime = new Date(`${dateStr}T${timeStr}:00`);
    return {
      type: 'earnings',
      datetime,
      timeStr,
      timeDescription,
      ...event,
    } as EarningsEvent;
  });

  const economicEventsForDate =
    calendarData?.filter(
      ({ impact, date }) =>
        impact === 'High' && format(new Date(date), 'yyyy-MM-dd') === dateStr,
    ) ?? [];

  const economicEvents = economicEventsForDate.map((event) => ({
    type: 'economic',
    datetime: new Date(event.date),
    ...event,
  })) as EconomicEventExtended[];

  const allEvents = [...earningsEvents, ...economicEvents].sort(
    (a, b) => a.datetime.getTime() - b.datetime.getTime(),
  ) as Event[];

  const groupedEvents: { time: string; events: Event[] }[] = [];
  let currentTime: string | undefined;

  for (const event of allEvents) {
    const timeStr = format(event.datetime, 'HH:mm');
    if (timeStr === currentTime) {
      groupedEvents.at(-1)?.events.push(event);
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
