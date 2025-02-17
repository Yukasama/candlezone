import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  EarningsEvent,
  EconomicEventExtended,
} from '@/features/home/types/events';
import { getCurrentEvents } from './actions/get-current-events';
import { EarningsBlock } from './earnings-block';

export const WhatsNext = async () => {
  const data = await getCurrentEvents();

  return (
    <div>
      {data?.events.map(({ events, time }) => {
        const earnings = events.filter(
          (event): event is EarningsEvent => event.type === 'earnings',
        );
        const economics = events.filter(
          (event): event is EconomicEventExtended => event.type === 'economic',
        );

        let description = time;
        if (earnings.length > 0 && economics.length === 0) {
          const earningsTime =
            earnings[0].earnings?.time?.toUpperCase() ?? 'N/A';
          description += ` - Earnings (${earningsTime})`;
        }

        return (
          <Card className="h-[350px] w-[600px] border" key={time}>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              {earnings.length > 0 && (
                <EarningsBlock
                  earnings={earnings}
                  portfolios={data.portfolios}
                />
              )}

              {/* {economics.map((event) => (
              <EconomicItem
                event={event}
                key={`${event.event}-${event.country}`}
              />
            ))} */}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
