import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/config/site';
import { getCurrentEarnings } from '@/features/earnings/lib/queries';
import { getEconomicCalendar } from '@/lib/fmp/info/get-economic-calendar';
import { getNews } from '@/lib/fmp/info/get-news';
import { EconomicEvent, NewsItem } from '@/lib/fmp/types/info';
import { addWeeks, startOfWeek } from 'date-fns';

export const metadata = {
  title: `Stock Research & Analysis | ${siteConfig.name}`,
};
// First, create types and helper functions
interface UnifiedEvent {
  type: 'earnings' | 'economic' | 'news';
  date: Date;
  content: {
    symbol?: string;
    companyName?: string;
    event?: string;
    title?: string;
    time?: string;
  };
}

function mapToUnifiedEvents(
  earnings: Awaited<ReturnType<typeof getCurrentEarnings>>,
  news?: NewsItem[],
  calendar?: EconomicEvent[],
): UnifiedEvent[] {
  return [
    // Map earnings events
    ...earnings.map((e) => ({
      type: 'earnings' as const,
      date: new Date(e.earningsDate!),
      content: {
        symbol: e.symbol,
        companyName: e.companyName,
        time: e.earningsTime ?? undefined,
      },
    })),
    // Map economic events
    ...(calendar?.map((e) => ({
      type: 'economic' as const,
      date: new Date(e.date),
      content: {
        event: e.event,
      },
    })) ?? []),
    // Map news events
    ...(news?.map((e) => ({
      type: 'news' as const,
      date: new Date(e.publishedDate),
      content: {
        title: e.title,
      },
    })) ?? []),
  ].filter((event) => !Number.isNaN(event.date.getTime()));
}

// Update the component
export default async function Homepage() {
  const today = new Date();
  const currentDay = today.getDay();

  const weekStart =
    currentDay === 6 || currentDay === 0
      ? startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 })
      : startOfWeek(today, { weekStartsOn: 1 });

  const [calendar, earnings, news] = await Promise.all([
    getEconomicCalendar(),
    getCurrentEarnings({ monday: weekStart }),
    getNews(),
  ]);

  const allEvents = mapToUnifiedEvents(earnings, news, calendar).sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  return (
    <div className="space-y-4 p-4">
      {allEvents.map((event, index) => (
        <div
          key={`${event.type}-${index}`}
          className="rounded-lg border bg-card p-4 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {event.date.toLocaleString()}
            </span>
            <Badge variant="outline">{event.type}</Badge>
          </div>

          {event.type === 'earnings' && (
            <div>
              <p className="font-semibold">{event.content.symbol}</p>
              <p className="text-sm text-muted-foreground">
                {event.content.companyName} - {event.content.time}
              </p>
            </div>
          )}

          {event.type === 'economic' && (
            <p className="text-sm">{event.content.event}</p>
          )}

          {event.type === 'news' && (
            <p className="text-sm font-medium">{event.content.title}</p>
          )}
        </div>
      ))}
    </div>
  );
}
