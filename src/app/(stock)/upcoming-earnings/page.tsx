import { daysOfWeek } from '@/features/earnings/config/earnings';
import { EarningsEntry } from '@/features/earnings/earnings-entry';
import { getCurrentEarnings } from '@/features/earnings/lib/queries';
import { addDays, addWeeks, format, startOfWeek } from 'date-fns';

export const metadata = { title: 'Upcoming Earnings' };

export default async function UpcomingEarnings() {
  const today = new Date();
  const currentDay = today.getDay();

  const weekStart =
    currentDay === 6 || currentDay === 0
      ? startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 })
      : startOfWeek(today, { weekStartsOn: 1 });

  const earnings = await getCurrentEarnings({ monday: weekStart });

  return (
    <div className="f-col gap-7 p-4 xl:grid xl:grid-cols-10 xl:p-10">
      {daysOfWeek.map((day, i) => {
        const date = format(addDays(weekStart, i), 'yyyy-MM-dd');
        const displayDate = format(addDays(weekStart, i), 'dd.MM');

        return (
          <div key={day} className="col-span-2 space-y-2">
            <div className="text-center font-bold">
              {day} <span className="text-gray-400">({displayDate})</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="text-center text-sm font-semibold">
                  Before Open
                </div>
                <div className="f-col gap-2">
                  {earnings
                    .filter(
                      ({ earningsDate, earningsTime }) =>
                        earningsDate instanceof Date &&
                        earningsDate.toISOString().split('T')[0] === date &&
                        earningsTime === 'bmo',
                    )
                    .slice(0, 7)
                    .map((entry) => (
                      <EarningsEntry key={entry.symbol} stock={entry} />
                    ))}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-center text-sm font-semibold">
                  After Market
                </div>
                <div className="f-col gap-2">
                  {earnings
                    .filter(
                      ({ earningsDate, earningsTime }) =>
                        earningsDate instanceof Date &&
                        earningsDate.toISOString().split('T')[0] === date &&
                        earningsTime === 'amc',
                    )
                    .slice(0, 7)
                    .map((entry) => (
                      <EarningsEntry key={entry.symbol} stock={entry} />
                    ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
