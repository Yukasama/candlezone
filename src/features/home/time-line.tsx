'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StockCard } from '@/features/stock/components/stock-card';
import { cn } from '@/lib/utils';
import { addMinutes, differenceInMinutes, format, isPast } from 'date-fns';
import { ArrowRight, ChevronLeft, Clock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { EconomicItem } from './economic-item';
import { StockEvent } from './types/events';

interface TimelineProps {
  timeEvents: StockEvent[];
  today: Date;
}

const useTimeUntilNext = (nextEventTime?: Date) => {
  const [timeUntilNext, setTimeUntilNext] = useState<string>('');

  useEffect(() => {
    const calculateTime = () => {
      if (!nextEventTime) {
        return '';
      }

      const now = new Date();
      const diff = differenceInMinutes(nextEventTime, now);

      if (diff <= 0) {
        return '';
      }
      return diff < 60
        ? `in ${String(diff)}m`
        : `in ${String(Math.floor(diff / 60))}h ${String(diff % 60)}m`;
    };

    setTimeUntilNext(calculateTime());
    const interval = setInterval(
      () => setTimeUntilNext(calculateTime()),
      60000,
    );
    return () => clearInterval(interval);
  }, [nextEventTime]);

  return timeUntilNext;
};

export const Timeline = ({ timeEvents, today }: TimelineProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentEventIndex = timeEvents.findIndex((event, index) => {
    const activeUntil =
      index < timeEvents.length - 1
        ? timeEvents[index + 1].datetime
        : addMinutes(event.datetime, 30);
    return today >= event.datetime && today <= activeUntil;
  });

  const currentEvent =
    currentEventIndex === -1 ? undefined : timeEvents[currentEventIndex];
  const nextEvent =
    currentEventIndex === -1 ? undefined : timeEvents[currentEventIndex + 1];
  const timeUntilNext = useTimeUntilNext(nextEvent?.datetime);

  const scrollToEvent = (event: StockEvent) => {
    const element = document.querySelector<HTMLElement>(
      `#event-${format(event.datetime, 'HH-mm')}`,
    );
    if (element && scrollRef.current) {
      const offset = 100;
      scrollRef.current.scrollTo({
        behavior: 'smooth',
        left: element.offsetLeft - offset,
      });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      e.preventDefault();
      const delta = e.deltaY || e.deltaX;
      scrollRef.current.scrollLeft += delta;
    }
  };

  useEffect(() => {
    if (currentEvent) {
      scrollToEvent(currentEvent);
    } else if (timeEvents.length > 0) {
      scrollToEvent(timeEvents[0]);
    }
  }, [currentEvent, timeEvents]);

  useEffect(() => {
    const checkCurrentEvent = () => {
      if (nextEvent && today >= nextEvent.datetime) {
        scrollToEvent(nextEvent);
      }
    };

    const interval = setInterval(checkCurrentEvent, 1000);
    return () => clearInterval(interval);
  }, [nextEvent, today]);

  if (timeEvents.length === 0) {
    return (
      <div className="text-muted-foreground text-center">
        No events scheduled
      </div>
    );
  }

  return (
    <div className="relative isolate w-full">
      {currentEventIndex > 0 && (
        <Button
          className="absolute top-1/2 left-0 z-10 -translate-y-1/2"
          onClick={() => scrollToEvent(timeEvents[0])}
          size="icon"
          variant="ghost"
        >
          <ChevronLeft className="size-4" />
        </Button>
      )}

      <div
        className="scrollbar-hide relative mx-4 overflow-x-auto overflow-y-hidden xl:mx-12"
        onWheel={handleWheel}
        ref={scrollRef}
      >
        <div className="flex gap-4 p-4">
          {timeEvents.map((event) => {
            const isActive = event === currentEvent;
            const isNext = event === nextEvent;
            const isPastEvent = isPast(event.datetime);

            return (
              <div
                className={cn(
                  'relative transition-all duration-300',
                  isActive && 'animate-highlight z-10',
                  event.type === 'earnings' && 'min-w-[450px]',
                )}
                id={`event-${format(event.datetime, 'HH-mm')}`}
                key={format(event.datetime, 'HH-mm')}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock
                      className={cn(
                        'size-4',
                        isActive ? 'text-primary' : 'text-muted-foreground',
                      )}
                    />
                    <span className="text-sm font-medium">
                      {format(event.datetime, 'HH:mm')}
                    </span>
                    {isActive && (
                      <div className="relative">
                        <div className="bg-success/50 absolute -inset-0.5 animate-pulse rounded-full" />
                        <div className="bg-success relative size-2.5 rounded-full" />
                      </div>
                    )}
                    {isPastEvent && !isActive && (
                      <Badge variant="secondary">In Past</Badge>
                    )}
                  </div>
                  {isNext && timeUntilNext && (
                    <Badge
                      className="flex items-center gap-1 text-xs font-medium"
                      variant="secondary"
                    >
                      <span>{timeUntilNext}</span>
                      <ArrowRight className="size-3" />
                    </Badge>
                  )}
                </div>

                <div
                  className={cn(
                    'bg-faded/50 rounded-lg border p-1 shadow-sm transition-all',
                    isActive && 'border-success/50 border',
                  )}
                >
                  {event.type === 'earnings' ? (
                    <div className="grid grid-cols-2 gap-1">
                      {event.events
                        .filter(
                          (item): item is typeof item & { type: 'earnings' } =>
                            item.type === 'earnings',
                        )
                        .slice(0, Math.min(6, event.events.length))
                        .map((item, i) => (
                          <div
                            className="bg-muted/50 rounded-md px-2 py-1"
                            key={`${event.type}-${String(i)}`}
                          >
                            <StockCard
                              stock={item}
                              subtext={item.earnings?.epsActual?.toString()}
                              width={180}
                            />
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {event.events
                        .filter(
                          (item): item is typeof item & { type: 'economic' } =>
                            item.type === 'economic',
                        )
                        .map((item, i) => (
                          <div
                            className="bg-muted/50 rounded-md px-2 py-1"
                            key={`${event.type}-${String(i)}`}
                          >
                            <EconomicItem
                              event={item}
                              isPending={
                                !item.actual && today >= event.datetime
                              }
                            />
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
