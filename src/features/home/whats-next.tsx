import { EconomicItem } from '@/features/home/economic-item';
import {
  EarningsEvent,
  EconomicEventExtended,
} from '@/features/home/types/events';
import { getCurrentEvents } from './actions/get-current-events';
import { EarningsBlock } from './earnings-block';

export const WhatsNext = async () => {
  const data = await getCurrentEvents();

  return (
    <div className="ml-2 flex gap-2 overflow-x-auto border-l px-2">
      {data?.events.map(({ events, time }) => {
        const earnings = events.filter(
          (event): event is EarningsEvent => event.type === 'earnings',
        );
        const economics = events.filter(
          (event): event is EconomicEventExtended => event.type === 'economic',
        );

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
