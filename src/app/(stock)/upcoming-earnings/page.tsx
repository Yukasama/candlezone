import { EarningsEntry } from '@/features/stock/earnings-entry';
import { db } from '@/lib/db';
import { addDays, addWeeks, endOfWeek, format, startOfWeek } from 'date-fns';

export default async function UpcomingEarnings() {
  const today = new Date();
  const currentDay = today.getDay();

  const weekStart =
    currentDay === 6 || currentDay === 0
      ? startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 })
      : startOfWeek(today, { weekStartsOn: 1 });

  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const monday = format(weekStart, 'yyyy-MM-dd');
  const friday = format(weekEnd, 'yyyy-MM-dd');

  const earnings = await db.stock.findMany({
    select: {
      symbol: true,
      companyName: true,
      image: true,
      mktCap: true,
      earningsDate: true,
      earningsEpsEstimated: true,
      earningsTime: true,
      earningsRevenue: true,
      earningsRevenueEstimated: true,
      earningsEps: true,
    },
    where: {
      earningsDate: {
        gte: monday,
        lte: friday,
      },
      symbol: {
        not: {
          contains: '.DE',
          equals: 'GOOGL',
        },
      },
      country: 'US',
    },
    orderBy: {
      mktCap: 'desc',
    },
    take: 100,
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="f-col gap-7 p-4 xl:grid xl:grid-cols-10 xl:p-10">
      {daysOfWeek.map((day, index) => {
        const date = format(addDays(weekStart, index), 'yyyy-MM-dd');
        const displayDate = format(addDays(weekStart, index), 'dd.MM');

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
                      (entry) =>
                        entry.earningsDate === date &&
                        entry.earningsTime === 'bmo',
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
                      (entry) =>
                        entry.earningsDate === date &&
                        entry.earningsTime === 'amc',
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
