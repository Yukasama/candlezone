import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isSameDay, subDays } from 'date-fns';
import { getCurrentEvents } from './actions/get-current-events';
import { Timeline } from './time-line';

export const WhatsNext = async () => {
  const data = await getCurrentEvents();
  if (data.events.length === 0) {
    return;
  }

  const today = new Date();
  const yesterday = subDays(today, 1);

  return (
    <Tabs className="w-full" defaultValue="today">
      <TabsList>
        <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
        <TabsTrigger value="today">Today</TabsTrigger>
      </TabsList>

      <TabsContent value="yesterday">
        <Timeline
          timeEvents={data.events.filter((e) =>
            isSameDay(e.datetime, yesterday),
          )}
          today={yesterday}
        />
      </TabsContent>

      <TabsContent value="today">
        <Timeline
          timeEvents={data.events.filter((e) => isSameDay(e.datetime, today))}
          today={today}
        />
      </TabsContent>
    </Tabs>
  );
};
