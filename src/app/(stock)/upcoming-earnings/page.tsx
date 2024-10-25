import { Card } from '@/components/ui/card';
import { StockImage } from '@/features/stock/components/stock-image';
import { db } from '@/lib/db';
import { addDays, addWeeks, endOfWeek, format, startOfWeek } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default async function UpcomingEarnings() {
  const today = new Date();
  const currentDay = today.getDay();

  const weekStart =
    currentDay === 5 || currentDay === 0
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
    <div className="f-col gap-7 p-4 lg:grid lg:grid-cols-10 lg:p-10">
      {daysOfWeek.map((day, index) => {
        const date = format(addDays(weekStart, index), 'yyyy-MM-dd');

        return (
          <div key={day} className="col-span-2 space-y-2">
            <div className="text-center font-bold">{day}</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="text-center text-sm font-semibold">BMO</div>
                <div className="f-col gap-2">
                  {earnings
                    .filter(
                      (entry) =>
                        entry.earningsDate === date &&
                        entry.earningsTime === 'bmo',
                    )
                    .slice(0, 7)
                    .map((entry) => (
                      <Card
                        key={entry.symbol}
                        className="f-col f-col relative items-center gap-1 bg-accent p-1 px-3"
                      >
                        <div className="bg-faded rounded-md border px-2 text-sm">
                          {entry.symbol}
                        </div>
                        <StockImage src={entry.image} />
                        <Link
                          href={`/stocks/${entry.symbol}`}
                          className="absolute right-2 top-2 text-gray-400"
                        >
                          <ExternalLink className="size-4" />
                        </Link>
                        <div className="flex gap-1">
                          <p className="text-sm text-gray-400">Est. EPS</p>
                          <p className="text-sm">
                            {entry.earningsEpsEstimated ?? 'N/A'}
                          </p>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-center text-sm font-semibold">AMC</div>
                <div className="f-col gap-2">
                  {earnings
                    .filter(
                      (entry) =>
                        entry.earningsDate === date &&
                        entry.earningsTime === 'amc',
                    )
                    .slice(0, 7)
                    .map((entry) => (
                      <Card
                        key={entry.symbol}
                        className="f-col f-col relative items-center gap-1 bg-accent p-1 px-3"
                      >
                        <div className="bg-faded rounded-md border px-2 text-sm">
                          {entry.symbol}
                        </div>
                        <StockImage src={entry.image} />
                        <Link
                          href={`/stocks/${entry.symbol}`}
                          className="absolute right-2 top-2 text-gray-400"
                        >
                          <ExternalLink className="size-4" />
                        </Link>
                        <div className="flex gap-1">
                          <p className="text-sm text-gray-400">Est. EPS</p>
                          <p className="text-sm">
                            {entry.earningsEpsEstimated ?? 'N/A'}
                          </p>
                        </div>
                      </Card>
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
