'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EconomicItem } from '@/features/home/economic-item';
import {
  EarningsEvent,
  EconomicEventExtended,
} from '@/features/home/types/events';
import { useQuery } from '@tanstack/react-query';
import { RotateCcw, TriangleAlert } from 'lucide-react';
import { getCurrentEvents } from './actions/get-current-events';
import { EarningsBlock } from './earnings-block';

export const WhatsNext = () => {
  const { data, isError, isLoading, refetch } = useQuery({
    queryFn: getCurrentEvents,
    queryKey: ['whats-next'],
    staleTime: 1000 * 60 * 60,
  });

  if (isLoading) {
    return (
      <div className="grid h-36 grid-cols-4 gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton className="rounded-lg" key={`${String(i)}-skeleton`} />
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
        <Button onClick={() => refetch()} size="icon-sm">
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
      {data.events.map(({ events, time }) => {
        const earnings = events.filter(
          (event): event is EarningsEvent => event.type === 'earnings',
        );
        const economics = events.filter(
          (event): event is EconomicEventExtended => event.type === 'economic',
        );

        console.log('earnings', earnings);

        let title = time;
        if (earnings.length > 0 && economics.length === 0) {
          const earningsTime =
            earnings[0].earnings?.time?.toUpperCase() ?? 'N/A';
          title += ` - Earnings (${earningsTime})`;
        }

        return (
          <div className="max-w-fit space-y-1.5" key={time}>
            {(earnings.length > 0 || economics.length > 0) && (
              <strong className="text-desc mb-1 font-light">{title}</strong>
            )}

            {earnings.length > 0 && (
              <EarningsBlock earnings={earnings} portfolios={data.portfolios} />
            )}

            {economics.map((event) => (
              <EconomicItem
                event={event}
                key={`${event.event}-${event.country}`}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};
