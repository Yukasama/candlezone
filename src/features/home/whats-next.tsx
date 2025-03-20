import { getCurrentEvents } from './actions/get-current-events';
import { Timeline } from './time-line';

export const WhatsNext = async () => {
  const data = await getCurrentEvents();

  if (!data) {
    return (
      <div className="text-muted-foreground p-4 text-center">
        No scheduled events found
      </div>
    );
  }

  if (
    data.events.today.length === 0 &&
    data.events.yesterday.length === 0 &&
    data.events.tomorrow.length === 0
  ) {
    return (
      <div className="text-muted-foreground p-4 text-center">
        No scheduled events found
      </div>
    );
  }

  return <Timeline events={data.events} />;
};
