import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { getCurrentEarnings } from '@/features/earnings/lib/queries';
import { StockImage } from '@/features/stock/components/stock-image';
import { getEconomicCalendar } from '@/lib/fmp/info/get-economic-calendar';
import { addDays, format, startOfWeek } from 'date-fns';
import { Coins } from 'lucide-react';
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
    <div className="space-y-6 p-4">
      <div className="flex gap-5">
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
                .map(({ date, event, country, impact }, i) => (
                  <div key={date + i} className="f-center flex-1 gap-4">
                    <Image
                      src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country === 'UK' ? 'GB' : country?.toUpperCase()}.svg`}
                      width={40}
                      height={30}
                      alt={`${country || 'Unknown'}`}
                      className="w-8 rounded-sm object-contain lg:w-10"
                    />
                    <div>
                      <p className="w-[200px] truncate text-sm font-semibold lg:w-full lg:text-[15px]">
                        {event || 'N/A'}
                      </p>
                      <div className="f-center gap-2">
                        <time dateTime={new Date(date).toISOString()}>
                          {new Date(date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </time>
                        <div
                          className={`f-box h-[18px] rounded-full px-2 text-xs font-semibold ${impactColors[impact] || impactColors.None}`}
                        >
                          {impact || 'None'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              <Card className="border">
                <h3 className="mb-2 text-sm text-gray-400">
                  22:00 - After Market Close
                </h3>
                <div className="flex flex-wrap gap-4">
                  {earningsForDate
                    .filter(({ earningsTime }) => earningsTime === 'amc')
                    .slice(0, Math.min(earningsForDate.length, 10))
                    .map(({ symbol, image, earningsEpsEstimated }) => (
                      <div className="f-col items-center" key={symbol}>
                        <Badge variant="outline">{symbol}</Badge>
                        <StockImage src={image} px={40} />
                        <div className="f-center gap-1">
                          <Coins className="size-4" />
                          {earningsEpsEstimated}
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
