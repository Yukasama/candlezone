'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { EconomicItem } from '@/features/home/economic-item';
import { useQuery } from '@tanstack/react-query';
import { getCurrentEvents } from './actions/get-current-events';
import { EarningsBlock } from './earnings-block';

export const WhatsNext = () => {
  const { data, isLoading, isFetched } = useQuery({
    queryFn: async () => await getCurrentEvents(),
    queryKey: ['whats-next'],
    staleTime: 1000 * 60 * 60,
  });

  if (!isFetched) {
    return (
      <div className="flex">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="mb-2 h-20 w-20 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!data && !isLoading) {
    return null;
  }

  return (
    <div className="relative space-y-2">
      <div className="absolute left-4 top-5 h-4 w-[1px] bg-border" />
      {data.events.map(({ time, events }) => {
        const earnings = events.filter(({ type }) => type === 'earnings');
        const economics = events.filter(({ type }) => type === 'economic');

        let title = time;
        if (earnings.length > 0 && economics.length === 0) {
          const timeDescription = earnings[0].timeDescription;
          title += ` - Earnings (${timeDescription})`;
        }

        const symbols = earnings.map((stock) => stock.symbol);
        const portfoliosWithMatchingOrders = data.portfolios?.filter(
          ({ orders }) =>
            orders.some(({ stock }) => symbols.includes(stock.symbol)),
        );

        return (
          <div
            key={time}
            className="flex max-w-fit space-y-1.5 overflow-x-auto"
          >
            {(earnings.length > 0 || economics.length > 0) && (
              <h3 className="mb-1 font-light text-gray-400">{title}</h3>
            )}

            <EarningsBlock earnings={earnings} portfolios={data.portfolios} />

            {economics.map((event) => (
              <EconomicItem key={event.event + event.country} event={event} />
            ))}
          </div>
        );
      })}
    </div>
  );
};
