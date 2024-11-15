import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { LampEffect } from '@/components/ui/lamp-effect';
import { siteConfig } from '@/config/site';
import { getCurrentEarnings } from '@/features/earnings/lib/queries';
import { PriceChart } from '@/features/stock/chart/price-chart';
import { StockImage } from '@/features/stock/components/stock-image';
import { getEconomicCalendar } from '@/lib/fmp/info/get-economic-calendar';
import { getNews } from '@/lib/fmp/info/get-news';
import { EconomicEvent } from '@/lib/fmp/types/info';
import { getCurrentWeek } from '@/lib/utils/date-helpers';
import { format, isSameDay, parseISO } from 'date-fns';
import { Coins } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const impactColors = {
  None: 'bg-gray-200 text-gray-800',
  Low: 'bg-emerald-500 text-white',
  Medium: 'bg-amber-600 text-white',
  High: 'bg-red-600 text-white',
};

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

  const [earningsData, calendarData, newsData] = await Promise.all([
    getCurrentEarnings({ monday: weekStart }),
    getEconomicCalendar(),
    getNews(),
  ]);

  return (
    <div className="f-col p-5 lg:grid lg:grid-cols-7">
      <div className="col-span-2">
        {newsData?.map((news) => (
          <Card key={news.url} className="p-4">
            <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-200">
              {news.title}
            </h3>
            <p className="text-gray-400 dark:text-gray-300">{news.text}</p>
            <div className="mt-3 flex items-center gap-2">
              <a
                href={news.url}
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
              >
                Read More
              </a>
              <p className="text-gray-400 dark:text-gray-300">
                {parseISO(news.publishedDate).toISOString()}
              </p>
            </div>
          </Card>
        ))}
      </div>
      <div className="col-span-3">
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
              (event) =>
                event.impact === 'High' &&
                format(new Date(event.date), 'yyyy-MM-dd') === dateStr,
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
            <div key={dateStr} className="relative space-y-4">
              <h2 className="mb-4 text-xl font-semibold text-gray-500 dark:text-gray-200">
                {format(date, 'EEEE, MMMM do')}
                {isSameDay(date, today) && <Link href="#today">(Today)</Link>}
              </h2>

              <div className="absolute left-5 top-3 h-4 w-[1px] bg-gray-400 dark:bg-gray-500" />
              {groupedEvents.map((group) => {
                const { time, events } = group;

                const earningsEvents = events
                  .filter((event) => event.type === 'earnings')
                  .slice(0, Math.max(8, events.length));
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
                      <h3 className="mb-1 text-xl font-light text-gray-400">
                        {title}
                      </h3>
                    )}
                    {economicEvents.length > 0 &&
                      earningsEvents.length === 0 && (
                        <h3 className="mb-1 text-xl font-light text-gray-400">
                          {time}
                        </h3>
                      )}

                    {earningsEvents.length > 0 && (
                      <div className="relative flex gap-5 px-5">
                        <div className="absolute left-5 top-0 h-full w-[1px] bg-gray-400 dark:bg-gray-500" />
                        <div className="ml-5 grid grid-cols-3 gap-2 md:flex md:flex-wrap">
                          {earningsEvents
                            .slice(0, Math.min(8, earningsEvents.length))
                            .map((event) => (
                              <Link
                                className="f-col bg-faded motion-preset-slide-right-sm min-w-32 gap-1 rounded-lg border p-2 hover:bg-accent"
                                href={`/stocks/${event.symbol}`}
                                key={event.symbol}
                              >
                                <div className="f-center gap-1">
                                  <StockImage src={event.image} px={40} />
                                  <Badge variant="secondary">
                                    {event.symbol}
                                  </Badge>
                                </div>
                                <div className="f-center gap-1 text-sm">
                                  <p className="text-gray-400">EPS</p>
                                  {event.earningsEpsEstimated}
                                  <Coins className="size-4" />
                                </div>
                              </Link>
                            ))}
                        </div>
                      </div>
                    )}

                    {economicEvents.length > 0 && (
                      <div className="flex flex-col gap-2 px-3">
                        {economicEvents.map((event) => (
                          <div
                            className="bg-faded flex items-center gap-3 rounded-lg border p-2 px-3.5"
                            key={event.event + event.country}
                          >
                            <Image
                              src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${
                                event.country === 'UK'
                                  ? 'GB'
                                  : event.country?.toUpperCase()
                              }.svg`}
                              width={40}
                              height={30}
                              alt={`${event.country || 'Unknown'}`}
                              className="w-8 rounded-sm object-contain lg:w-10"
                            />
                            <div>
                              <p className="truncate text-sm font-semibold lg:text-[15px]">
                                {event.event || 'N/A'}
                              </p>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`f-box h-[18px] rounded-full px-2 text-xs font-semibold ${
                                    impactColors[event.impact] ||
                                    impactColors.None
                                  }`}
                                >
                                  {event.impact || 'None'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="col-span-2">
        <LampEffect />
        <PriceChart symbol="SPY" className="sm:h-[300px]" />
      </div>
    </div>
  );
}
