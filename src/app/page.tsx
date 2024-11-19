import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { getCurrentEarnings } from '@/features/earnings/lib/queries';
import { IndexChart } from '@/features/home/index-chart';
import { NewsSlider } from '@/features/home/news-slider';
import { PortfolioImage } from '@/features/portfolio/components/portfolio-image';
import { getFullPortfoliosByUser } from '@/features/portfolio/lib/queries';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { getUser } from '@/lib/auth';
import { getEconomicCalendar } from '@/lib/fmp/info/get-economic-calendar';
import { getNews } from '@/lib/fmp/info/get-news';
import { EconomicEvent } from '@/lib/fmp/types/info';
import { getCurrentWeek } from '@/lib/utils/date-helpers';
import { formatMarketCap } from '@/lib/utils/stock-helper';
import { addDays, format, isSameDay, parseISO } from 'date-fns';
import Image from 'next/image';

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

  const user = await getUser();
  const [portfolios, earningsData, calendarData, newsData] = await Promise.all([
    user ? getFullPortfoliosByUser({ userId: user?.id }) : undefined,
    getCurrentEarnings({ monday: weekStart }),
    getEconomicCalendar(),
    getNews(),
  ]);

  return (
    <div className="f-col gap-6 p-5 lg:grid lg:grid-cols-7">
      <div className="col-span-2 hidden xl:block"></div>
      <div className="col-span-5 space-y-4 xl:col-span-3">
        <div className="f-col gap-4">
          <NewsSlider newsData={newsData} />
          <IndexChart />
        </div>
      </div>
      <div className="col-span-2">
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
            <div key={dateStr} className="relative space-y-4">
              <h2 className="mb-4 text-xl font-semibold text-gray-500 dark:text-gray-200">
                {format(date, 'EEEE, MMMM do')}
                {isSameDay(date, today)
                  ? ' (Today)'
                  : today.getDay() === 0 && isSameDay(date, addDays(today, 1))
                    ? ' (Tomorrow)'
                    : ''}
              </h2>

              <div className="absolute left-5 top-3 h-4 w-[1px] bg-gray-400 dark:bg-gray-500" />
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
                      <div className="relative flex gap-5 px-5">
                        <div className="absolute left-5 top-0 h-full w-[1px] bg-gray-400 dark:bg-gray-600" />
                        <Accordion
                          className="w-full pl-3"
                          type="single"
                          collapsible
                        >
                          {earningsEvents
                            .slice(0, Math.min(5, earningsEvents.length))
                            .map(({ symbol, ...stock }) => (
                              <AccordionItem
                                value={symbol}
                                className="bg-faded mb-[5px] rounded-lg border px-2"
                                key={symbol + 'earnings'}
                              >
                                <AccordionTrigger className="h-[52px]">
                                  <div className="f-center gap-4">
                                    <SymbolItem
                                      stock={{ symbol, ...stock }}
                                      fullLength
                                    />
                                    {portfolios?.map(
                                      ({ orders, ...portfolio }) =>
                                        orders.filter(
                                          ({ stock }) =>
                                            stock.symbol === symbol,
                                        ).length > 0 && (
                                          <PortfolioImage
                                            key={portfolio.id + symbol}
                                            px={25}
                                            portfolio={portfolio}
                                          />
                                        ),
                                    )}
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="flex gap-5 p-1 px-3 pb-2">
                                  <div>
                                    <p className="text-sm text-gray-400">
                                      Est. EPS
                                    </p>
                                    <p className="text-[15px]">
                                      {stock.earningsEpsEstimated}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-400">
                                      Actual EPS
                                    </p>
                                    <p className="text-[15px]">
                                      {stock.earningsEps ?? 'Not released yet.'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-400">
                                      Est. Revenue
                                    </p>
                                    <p className="text-[15px]">
                                      {formatMarketCap(
                                        stock.earningsRevenueEstimated!,
                                      )}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-400">
                                      Actual Revenue
                                    </p>
                                    <p className="text-[15px]">
                                      {stock.earningsRevenue
                                        ? formatMarketCap(stock.earningsRevenue)
                                        : 'Not released yet.'}
                                    </p>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                        </Accordion>
                      </div>
                    )}

                    {economicEvents.length > 0 && (
                      <div className="flex flex-col gap-2 px-3">
                        {economicEvents.map(({ event, country, impact }) => (
                          <div
                            className="bg-faded flex items-center gap-3 rounded-lg border p-2 px-3.5"
                            key={event + country}
                          >
                            <Image
                              src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${
                                country === 'UK' ? 'GB' : country?.toUpperCase()
                              }.svg`}
                              width={40}
                              height={30}
                              alt={`${country || 'Unknown'}`}
                              className="w-8 rounded-sm object-contain lg:w-10"
                            />
                            <div>
                              <p className="truncate text-sm font-semibold lg:text-[15px]">
                                {event || 'N/A'}
                              </p>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`f-box h-[18px] rounded-full px-2 text-xs font-semibold ${
                                    impactColors[impact] || impactColors.None
                                  }`}
                                >
                                  {impact || 'None'}
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
    </div>
  );
}
