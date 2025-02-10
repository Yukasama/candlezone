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
    <div className="flex flex-col gap-7 p-4 xl:grid xl:grid-cols-10 xl:p-10">
      {daysOfWeek.map((day, i) => {
        const date = format(addDays(weekStart, i), 'yyyy-MM-dd');
        const displayDate = format(addDays(weekStart, i), 'dd.MM');

        return (
          <div className="col-span-2 space-y-2" key={day}>
            <div className="text-center font-bold">
              {day} <span className="text-desc">({displayDate})</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="text-center text-sm font-semibold">
                  Before Open
                </div>
                <div className="flex flex-col gap-2">
                  {earnings
                    .filter(
                      ({ earningsDate, earningsTime }) =>
                        earningsDate &&
                        format(new Date(earningsDate), 'yyyy-MM-dd') === date &&
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
                <div className="flex flex-col gap-2">
                  {earnings
                    .filter(
                      ({ earningsDate, earningsTime }) =>
                        earningsDate &&
                        format(new Date(earningsDate), 'yyyy-MM-dd') === date &&
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
