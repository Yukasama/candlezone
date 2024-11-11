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
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-6 p-4">
      <div className="f-col gap-4 xl:grid xl:grid-cols-5">
        {weekDays.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');

          const earningsForDate = earnings.filter(
            (event) =>
              event.earningsDate &&
              format(event.earningsDate, 'yyyy-MM-dd') === dateStr,
          );

          return (
            <div key={dateStr} className="space-y-5">
              <h2 className="mb-4 text-xl font-semibold">
                {format(date, 'EEEE, MMMM do')}
              </h2>
              <Card>
                <h3 className="text-md mb-2">13:00 - Before Market Open</h3>
                <div className="grid grid-cols-3 gap-1.5">
                  {earningsForDate
                    .filter(({ earningsTime }) => earningsTime === 'bmo')
                    .slice(0, Math.min(earningsForDate.length, 10))
                    .map(({ symbol, image, earningsEpsEstimated }) => (
                      <div
                        className="f-col bg-faded gap-1 rounded-lg border p-2"
                        key={symbol}
                      >
                        <div className="f-center gap-1">
                          <StockImage src={image} px={40} />
                          <Badge variant="secondary">{symbol}</Badge>
                        </div>
                        <div className="f-center gap-1 text-sm">
                          <p className="text-gray-400">EPS</p>
                          {earningsEpsEstimated}
                          <Coins className="size-4" />
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
              <Card className="space-y-1.5">
                <h3 className="text-md mb-0.5">Economic Events</h3>
                {calendar
                  ?.filter(
                    (event) =>
                      event.impact === 'High' &&
                      format(event.date, 'yyyy-MM-dd') === dateStr,
                  )
                  .map(({ date, event, country, impact }, i) => (
                    <div
                      key={date + i}
                      className="f-center bg-faded flex-1 gap-3 rounded-lg border p-1 px-3 pb-0.5"
                    >
                      <Image
                        src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country === 'UK' ? 'GB' : country?.toUpperCase()}.svg`}
                        width={40}
                        height={30}
                        alt={`${country || 'Unknown'}`}
                        className="w-8 rounded-sm object-contain lg:w-10"
                      />
                      <div>
                        <p className="w-[200px] truncate text-sm font-semibold lg:text-[15px]">
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
              </Card>
              <Card>
                <h3 className="text-md mb-2">22:00 - After Market Close</h3>
                <div className="grid grid-cols-3 gap-1.5">
                  {earningsForDate.length > 0 ? (
                    earningsForDate
                      .filter(({ earningsTime }) => earningsTime === 'amc')
                      .slice(0, Math.min(earningsForDate.length, 10))
                      .map(({ symbol, image, earningsEpsEstimated }) => (
                        <div
                          className="f-col bg-faded gap-1 rounded-lg border p-2"
                          key={symbol}
                        >
                          <div className="f-center gap-1">
                            <StockImage src={image} px={40} />
                            <Badge variant="secondary">{symbol}</Badge>
                          </div>
                          <div className="f-center gap-1 text-sm">
                            <p className="text-gray-400">EPS</p>
                            {earningsEpsEstimated}
                            <Coins className="size-4" />
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-center text-sm text-gray-400">
                      No earnings happening
                    </p>
                  )}
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
