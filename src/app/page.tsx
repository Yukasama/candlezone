import { PageLayout } from '@/components/page-layout';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { getCurrentEarnings } from '@/features/earnings/lib/queries';
import { StockImage } from '@/features/stock/components/stock-image';
import { getEconomicCalendar } from '@/lib/fmp/info/get-economic-calendar';
import { addDays, format, startOfWeek } from 'date-fns';
import { TrendingUpDown } from 'lucide-react';

export const metadata = {
  title: `Stock Research & Analysis | ${siteConfig.name}`,
};

export default async function Homepage() {
  const today = new Date();
  const currentDay = today.getDay();

  const daysToAdd = currentDay === 6 ? 2 : currentDay === 0 ? 1 : 0;

  const weekStart = startOfWeek(addDays(today, daysToAdd), { weekStartsOn: 1 });

  const earnings = await getCurrentEarnings({ monday: weekStart });
  const calendar = await getEconomicCalendar();
  const weekDays = Array.from({ length: 4 }, (_, i) =>
    addDays(weekStart, i + 1),
  );

  return (
    <PageLayout className="space-y-6 p-4">
      <div className="flex">
        {weekDays.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');

          const earningsForDate = earnings.filter(
            (event) =>
              event.earningsDate &&
              format(event.earningsDate, 'yyyy-MM-dd') === dateStr,
          );

          return (
            <div key={dateStr}>
              <h2 className="mb-4 text-xl font-semibold">
                {format(date, 'EEEE, MMMM do')}
              </h2>
              <Card className="border">
                <h3 className="mb-2 text-sm text-gray-400">
                  Before Market Open
                </h3>
                <div className="flex flex-wrap gap-4">
                  {earningsForDate
                    .filter((event) => event.earningsTime === 'bmo')
                    .slice(0, Math.min(earningsForDate.length, 10))
                    .map((event) => (
                      <div key={event.symbol}>
                        <div>{event.symbol}</div>
                        <div>{event.earningsEps}</div>
                        <StockImage src={event.image} px={40} />
                      </div>
                    ))}
                </div>
              </Card>
              {calendar
                ?.filter(
                  (event) =>
                    event.impact === 'High' &&
                    format(event.date, 'yyyy-MM-dd') === dateStr,
                )
                .map((event, i) => (
                  <Card key={event.event + i} className="border">
                    <h3 className="mb-2 text-sm text-gray-400">
                      {format(event.date, 'HH:mm')} - {event.country}
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      <div>
                        <h3 className="mb-2 font-semibold">{event.event}</h3>
                        <p>{event.impact}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              <Card className="border">
                <h3 className="mb-2 text-sm text-gray-400">
                  22:00 - After Market Close
                </h3>
                <div className="flex flex-wrap gap-4">
                  {earningsForDate
                    .filter((event) => event.earningsTime === 'amc')
                    .slice(0, Math.min(earningsForDate.length, 10))
                    .map((event) => (
                      <div key={event.symbol}>
                        <Badge>{event.symbol}</Badge>
                        <div>
                          <TrendingUpDown className="size-4" />
                          {event.earningsEpsEstimated}
                        </div>
                        <StockImage src={event.image} px={40} />
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
