import { Accordion } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { getCurrentEarnings } from '@/features/earnings/lib/queries';
import { EarningsItem } from '@/features/home/earnings-item';
import { EconomicItem } from '@/features/home/economic-item';
import { IndexChart } from '@/features/home/index-chart';
import { NewsSlider } from '@/features/home/news-slider';
import { getPortfoliosWithOrdersByUser } from '@/features/portfolio/lib/queries';
import { getUser } from '@/lib/auth';
import { getEconomicCalendar } from '@/lib/fmp/info/get-economic-calendar';
import { getNews } from '@/lib/fmp/info/get-news';
import { EconomicEvent } from '@/lib/fmp/types/info';
import { getCurrentWeek } from '@/lib/utils/date-helpers';
import { addDays, format, isSameDay, parseISO } from 'date-fns';

export const metadata = {
  title: `Stock Research & Analysis | ${siteConfig.name}`,
};

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

export default async function Homepage() {
  const { today, weekStart, weekDays } = getCurrentWeek();

  const user = await getUser();
  const [portfolios, earningsData, calendarData, newsData] = await Promise.all([
    user ? getPortfoliosWithOrdersByUser({ userId: user?.id }) : undefined,
    getCurrentEarnings({ monday: weekStart }),
    getEconomicCalendar(),
    getNews(),
  ]);

  return (
    <div className="f-col gap-6 p-2 sm:p-4 lg:grid lg:grid-cols-7">
      <div className="col-span-2 hidden xl:block"></div>
      <div className="col-span-5 space-y-4 xl:col-span-3">
        <div className="f-col gap-4">
          <NewsSlider newsData={newsData} />
          <IndexChart />
        </div>
      </div>
      <div className="col-span-2 h-[80vh] overflow-auto">
        {weekDays.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');

          const earningsForDate = earningsData.filter(
            (event) =>
              event.earningsDate &&
              format(new Date(event.earningsDate), 'yyyy-MM-dd') === dateStr,
          );

          const earningsEvents: EarningsEvent[] = earningsForDate.map(
            (event) => {
              const timeStr = event.earningsTime === 'bmo' ? '13:00' : '22:00';
              const timeDescription =
                event.earningsTime === 'bmo'
                  ? 'Before Market Open'
                  : 'After Market Close';
              const datetime = parseISO(`${dateStr}T${timeStr}:00`);
              return {
                type: 'earnings',
                datetime,
                timeStr,
                timeDescription,
                ...event,
              };
            },
          );

          const economicEventsForDate =
            calendarData?.filter(
              ({ impact, date }) =>
                impact === 'High' &&
                format(new Date(date), 'yyyy-MM-dd') === dateStr,
            ) ?? [];

          const economicEvents: EconomicEventExtended[] =
            economicEventsForDate.map((event) => ({
              type: 'economic',
              datetime: new Date(
                new Date(event.date).getTime() + 60 * 60 * 1000,
              ),
              ...event,
            }));

          const allEvents: Event[] = [
            ...earningsEvents,
            ...economicEvents,
          ].sort((a, b) => a.datetime.getTime() - b.datetime.getTime());

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

          return (
            <div key={dateStr} className="relative space-y-2">
              <h2 className="my-4 text-xl font-semibold text-gray-500 dark:text-gray-200">
                {format(date, 'EEEE, MMMM do')}
                {isSameDay(date, today)
                  ? ' (Today)'
                  : today.getDay() === 0 && isSameDay(date, addDays(today, 1))
                    ? ' (Tomorrow)'
                    : ''}
              </h2>

              <div className="absolute left-4 top-5 h-4 w-[1px] bg-border" />
              {groupedEvents.map((group) => {
                const { time, events } = group;

                const earningsEvents = events.filter(
                  (event) => event.type === 'earnings',
                );
                const economicEvents = events.filter(
                  (event) => event.type === 'economic',
                );

                let title = time;
                if (earningsEvents.length > 0 && economicEvents.length === 0) {
                  const timeDescription = earningsEvents[0].timeDescription;
                  title += ` - Earnings (${timeDescription})`;
                }

                return (
                  <Card key={time + dateStr} className="space-y-1.5">
                    {earningsEvents.length > 0 && (
                      <h3 className="mb-1 text-lg font-light text-gray-400">
                        {title}
                      </h3>
                    )}

                    {economicEvents.length > 0 &&
                      earningsEvents.length === 0 && (
                        <h3 className="mb-1 text-lg font-light text-gray-400">
                          {time}
                        </h3>
                      )}

                    {earningsEvents.length > 0 && (
                      <div className="mx-4 flex flex-wrap gap-1 border-l px-3">
                        {earningsEvents
                          .slice(0, Math.min(7, earningsEvents.length))
                          .map((stock, i) => (
                            <EarningsItem
                              key={stock.symbol + i}
                              stock={stock}
                              portfolios={portfolios}
                            />
                          ))}
                      </div>
                    )}

                    {economicEvents.length > 0 && (
                      <Accordion
                        type="single"
                        collapsible
                        className="f-col mx-4 gap-1 border-l px-3"
                      >
                        {economicEvents.map((event) => (
                          <EconomicItem
                            key={event.event + event.country}
                            event={event}
                          />
                        ))}
                      </Accordion>
                    )}
                  </Card>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
