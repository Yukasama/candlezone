'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EconomicItem } from '@/features/home/economic-item';
import { useQuery } from '@tanstack/react-query';
import { RotateCcw, TriangleAlert } from 'lucide-react';
import { getCurrentEvents } from './actions/get-current-events';
import { EarningsBlock } from './earnings-block';
import { EarningsEvent, EconomicEventExtended } from './lib/format-events';

export const WhatsNext = () => {
  const { data, refetch, isLoading, isError } = useQuery({
    queryFn: getCurrentEvents,
    queryKey: ['whats-next'],
    staleTime: 1000 * 60 * 60,
  });

  if (isLoading) {
    return (
      <div className="grid h-36 grid-cols-4 gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="f-col h-36 items-center gap-2">
        <div className="f-center gap-1">
          <TriangleAlert className="size-4 text-gray-400" />
          <p className="text-[15px] text-gray-400">Events failed to load.</p>
        </div>
        <Button size="icon-sm" onClick={() => refetch()}>
          <RotateCcw className="size-4" />
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="ml-2 flex gap-2 overflow-x-auto border-l px-2">
      {data.events.map(({ time, events }) => {
        const earnings = events.filter(
          ({ type }) => type === 'earnings',
        ) as EarningsEvent[];
        const economics = events.filter(
          ({ type }) => type === 'economic',
        ) as EconomicEventExtended[];

        let title = time;
        if (earnings.length > 0 && economics.length === 0) {
          title += ` - Earnings (${earnings[0].earningsTime.toUpperCase()})`;
        }

        return (
          <div key={time} className="max-w-fit space-y-1.5">
            {(earnings.length > 0 || economics.length > 0) && (
              <h3 className="mb-1 font-light text-gray-400">{title}</h3>
            )}

            {earnings.length > 0 && (
              <EarningsBlock earnings={earnings} portfolios={data.portfolios} />
            )}

            {economics.map((event) => (
              <EconomicItem
                key={`${event.event}-${event.country}`}
                event={event}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};
