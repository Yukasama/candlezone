import { PageLayout } from '@/components/page-layout';
import { Card } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { getCurrentEarnings } from '@/features/earnings/lib/queries';
import { StockImage } from '@/features/stock/components/stock-image';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { addDays, format, startOfWeek } from 'date-fns';

export const metadata = {
  title: `Stock Research & Analysis | ${siteConfig.name}`,
};
export const runtime = 'edge';

export default async function Homepage() {
  const today = new Date();
  const currentDay = today.getDay();

  const daysToAdd = currentDay === 6 ? 2 : currentDay === 0 ? 1 : 0;

  const weekStart = startOfWeek(addDays(today, daysToAdd), { weekStartsOn: 1 });

  const earnings = await getCurrentEarnings({ monday: weekStart });
  const weekDays = Array.from({ length: 4 }, (_, i) =>
    addDays(weekStart, i + 1),
  );

  return (
    <PageLayout className="space-y-6 p-4">
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
            <Card>
              <h3 className="mb-2 font-semibold">Before Market Open</h3>
              <div className="flex flex-wrap gap-4">
                {earningsForDate
                  .filter((event) => event.earningsTime === 'bmo')
                  .map((event) => (
                    <div key={event.symbol}>
                      <SymbolItem stock={event} fullLength />
                    </div>
                  ))}
              </div>
            </Card>
            <Card className="border">
              <h3 className="mb-2 text-sm text-gray-400">
                22:00 - After Market Close
              </h3>
              <div className="flex flex-wrap gap-4">
                {earningsForDate
                  .filter((event) => event.earningsTime === 'amc')
                  .map((event) => (
                    <div key={event.symbol}>
                      <StockImage src={event.image} px={50} />
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        );
      })}
    </PageLayout>
  );
}
