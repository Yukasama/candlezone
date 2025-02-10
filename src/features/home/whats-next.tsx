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
          <Skeleton key={`${String(i)}-skeleton`} className="rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-36 flex-col items-center gap-2">
        <div className="flex items-center gap-1">
          <TriangleAlert className="text-desc size-4" />
          <p className="text-desc text-[15px]">Events failed to load.</p>
        </div>
        <Button size="icon-sm" onClick={() => refetch()}>
          <RotateCcw className="size-4" />
          Try again
        </Button>
      </div>
    );
  }

  if (data.events.length === 0) {
    return (
      <div className="flex h-36 items-center gap-1">
        <TriangleAlert className="text-desc size-4" />
        <p className="text-desc text-[15px]">No events happening today.</p>
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
          const earningsTime =
            earnings[0]?.earningsTime?.toUpperCase() ?? 'N/A';
          title += ` - Earnings (${earningsTime})`;
        }

        return (
          <div key={time} className="max-w-fit space-y-1.5">
            {(earnings.length > 0 || economics.length > 0) && (
              <strong className="text-desc mb-1 font-light">{title}</strong>
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
