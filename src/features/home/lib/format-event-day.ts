import { EventsByDay, EventWithType, StockEvent } from '../types/events';

export const formatEventDay = (
  dateStr: string,
  dayKey: keyof EventsByDay,
  rawEvents: Record<string, Record<string, EventWithType[]>>,
  result: EventsByDay,
) => {
  const dateTimes = Object.keys(rawEvents[dateStr]).sort((a, b) =>
    a.localeCompare(b),
  );

  for (const timeKey of dateTimes) {
    const events = rawEvents[dateStr][timeKey];
    if (events.length === 0) {
      continue;
    }

    const eventTypes = events.map((e) => e.type);
    const type =
      eventTypes.filter((t) => t === 'earnings').length >=
      eventTypes.filter((t) => t === 'economic').length
        ? 'earnings'
        : 'economic';

    const stockEvent: StockEvent = {
      datetime: new Date(timeKey),
      events,
      type,
    };

    result[dayKey].push(stockEvent);
  }
};
