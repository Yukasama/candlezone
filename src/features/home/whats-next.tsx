import { getCurrentEvents } from './actions/get-current-events';
import { Timeline } from './time-line';

export const WhatsNext = async () => {
  const data = await getCurrentEvents();
  if (data.events.length === 0) {
    return;
  }

  return <Timeline timeEvents={data.events} />;
};
