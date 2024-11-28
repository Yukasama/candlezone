import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { siteConfig } from '@/config/site';
import { getCurrentEarnings } from '@/features/earnings/lib/queries';
import { EarningsItem } from '@/features/home/earnings-item';
import { EconomicItem } from '@/features/home/economic-item';
import { IndexChart } from '@/features/home/index-chart';
import { NewsSlider } from '@/features/home/news-slider';
import { PortfolioImage } from '@/features/portfolio/components/portfolio-image';
import { getPortfoliosWithOrdersByUser } from '@/features/portfolio/lib/queries';
import { SymbolItem } from '@/features/stock/components/symbol-item';
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
    <div className="f-col gap-4 p-3 sm:p-4 lg:grid lg:grid-cols-7">
      <div className="col-span-2 hidden 2xl:block"></div>
      <div className="col-span-5 space-y-2 2xl:col-span-3">
        <NewsSlider newsData={newsData} />
        <IndexChart />
      </div>
      <div className="col-span-2 h-[80vh]">
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

                const earnings = events.filter(
                  ({ type }) => type === 'earnings',
                );
                const economics = events.filter(
                  ({ type }) => type === 'economic',
                );

                let title = time;
                if (earningsEvents.length > 0 && economics.length === 0) {
                  const timeDescription = earningsEvents[0].timeDescription;
                  title += ` - Earnings (${timeDescription})`;
                }

                const symbols = earnings.map((stock) => stock.symbol);
                const portfoliosWithMatchingOrders = portfolios?.filter(
                  ({ orders }) =>
                    orders.some(({ stock }) => symbols.includes(stock.symbol)),
                );

                return (
                  <div key={time + dateStr} className="space-y-1.5">
                    {earningsEvents.length > 0 && (
                      <h3 className="mb-1 text-lg font-light text-gray-400">
                        {title}
                      </h3>
                    )}

                    {earnings.length > 0 && (
                      <Accordion
                        type="single"
                        collapsible
                        className="f-col ml-4 gap-1 border-l pl-3"
                      >
                        <AccordionItem
                          value={date + 'earnings'}
                          className="bg-faded rounded-lg border px-2.5 py-0.5"
                        >
                          <AccordionTrigger className="py-1.5 hover:no-underline">
                            <div className="f-col gap-1.5">
                              <div className="flex gap-2 hover:no-underline">
                                {earnings
                                  .slice(0, Math.min(6, earnings.length))
                                  .map((stock) => (
                                    <EarningsItem
                                      key={stock.symbol + 'earnings'}
                                      stock={stock}
                                    />
                                  ))}
                              </div>

                              {portfoliosWithMatchingOrders?.map(
                                ({ id, ...portfolio }) => (
                                  <>
                                    <Separator />
                                    <PortfolioImage
                                      key={id}
                                      px={25}
                                      portfolio={portfolio}
                                    />
                                  </>
                                ),
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="f-col -mb-2 gap-1.5 px-2 pt-1">
                          <Separator />
                            {earnings.map((stock) => (
                              <div key={stock.symbol + 'earnings'}>
                                <SymbolItem stock={stock} fullLength />
                                <p className="text-sm font-semibold">
                                  {stock.earningsEpsEstimated
                                    ? `EPS Estimate: $${stock.earningsEpsEstimated}`
                                    : ''}
                                </p>
                                <p className="text-sm font-semibold">
                                  {stock.earningsRevenueEstimated
                                    ? `Revenue Estimate: $${stock.earningsRevenueEstimated}`
                                    : ''}
                                </p>
                                <p className="text-sm font-semibold">
                                  {stock.earningsEps
                                    ? `EPS: $${stock.earningsEps}`
                                    : ''}
                                </p>
                                <p className="text-sm font-semibold">
                                  {stock.earningsRevenue
                                    ? `Revenue: $${stock.earningsRevenue}`
                                    : ''}
                                </p>
                              </div>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}

                    {economics.length > 0 && (
                      <Accordion
                        type="single"
                        collapsible
                        className="f-col ml-4 gap-1 border-l pl-3"
                      >
                        {economics.map((event) => (
                          <EconomicItem
                            key={event.event + event.country}
                            event={event}
                          />
                        ))}
                      </Accordion>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
