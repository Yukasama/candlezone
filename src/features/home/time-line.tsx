'use client';

import { Badge } from '@/components/ui/badge';
import { StockCard } from '@/features/stock/components/stock-card';
import { cn } from '@/lib/utils';
import { addMinutes, differenceInMinutes, format, isPast } from 'date-fns';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { StockImage } from '../stock/components/stock-image';
import { EconomicItem } from './economic-item';
import { EventsByDay, StockEvent } from './types/events';

interface TimelineProps {
  events: EventsByDay;
}

const useTimeUntilNext = (nextEventTime?: Date) => {
  const [timeUntilNext, setTimeUntilNext] = useState('');

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

const EventList = ({
  currentEvent,
  events,
  isCompact = false,
  nextEvent,
  showTitle = false,
  title = '',
}: {
  currentEvent?: StockEvent;
  events: StockEvent[];
  isCompact?: boolean;
  nextEvent?: StockEvent;
  showTitle?: boolean;
  title?: string;
}) => {
  const today = new Date();
  const scrollRef = useRef<HTMLDivElement>(null);
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
    } else if (events.length > 0 && !isCompact) {
      scrollToEvent(events[0]);
    }
  }, [currentEvent, events, isCompact]);

  if (events.length === 0) {
    return (
      <div
        className={cn(
          'text-muted-foreground p-4 text-center',
          isCompact ? 'text-sm' : '',
        )}
      >
        No events scheduled
      </div>
    );
  }

  return (
    <div className={cn('relative w-full', isCompact ? 'max-h-[200px]' : '')}>
      {showTitle && (
        <div className="text-muted-foreground mb-2 text-center text-sm font-medium">
          {title}
        </div>
      )}

      <div
        className="scrollbar-hide relative overflow-x-auto overflow-y-hidden"
        onWheel={handleWheel}
        ref={scrollRef}
      >
        <div className={cn('flex gap-2 p-2', isCompact ? 'flex-col' : 'p-4')}>
          {events.map((event) => {
            const isActive = event === currentEvent;
            const isNext = event === nextEvent;
            const isPastEvent = isPast(event.datetime);

            return (
              <div
                className={cn(
                  'relative transition-all duration-300',
                  isActive && !isCompact && 'animate-highlight z-10 scale-105',
                  !isCompact && event.type === 'earnings' && 'min-w-[450px]',
                  isCompact && 'mb-2 min-h-[40px]',
                )}
                id={`event-${format(event.datetime, 'HH-mm')}`}
                key={`${isCompact ? 'compact-' : ''}${format(event.datetime, 'HH-mm')}`}
              >
                <div
                  className={cn(
                    'mb-2 flex items-center',
                    isCompact ? 'justify-start text-xs' : 'justify-between',
                  )}
                >
                  <div className="flex items-center gap-2">
                    {isActive && !isCompact && (
                      <div className="relative">
                        <div className="bg-success/50 absolute -inset-0.5 animate-pulse rounded-full" />
                        <div className="bg-success relative size-2.5 rounded-full" />
                      </div>
                    )}
                    {isPastEvent && !isActive && !isCompact && (
                      <Badge variant="secondary">In Past</Badge>
                    )}
                  </div>
                </div>

                {!isCompact && (
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
                            (
                              item,
                            ): item is typeof item & { type: 'earnings' } =>
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
                                subtext={`EPS Est: ${String(item.earnings[0]?.epsEstimated ?? '-')} | Act: ${String(item.earnings[0]?.epsActual ?? '-')}`}
                                width={180}
                              />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {event.events
                          .filter(
                            (
                              item,
                            ): item is typeof item & { type: 'economic' } =>
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
                )}

                {isCompact && (
                  <div className="text-muted-foreground text-xs">
                    {event.events.map((item) =>
                      item.type === 'earnings' ? (
                        <div key={item.symbol}>
                          <StockImage px={32} src={item.image} />
                        </div>
                      ) : (
                        <div key={item.country}>
                          <Image
                            alt={item.country}
                            className="rounded-sm"
                            height={27}
                            src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${
                              item.country === 'UK'
                                ? 'GB'
                                : item.country.toUpperCase()
                            }.svg`}
                            width={28}
                          />
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const Timeline = ({ events }: TimelineProps) => {
  const today = new Date();
  const todayEvents = events.today;

  const currentEventIndex = todayEvents.findIndex((event, index) => {
    const activeUntil =
      index < todayEvents.length - 1
        ? todayEvents[index + 1].datetime
        : addMinutes(event.datetime, 30);
    return today >= event.datetime && today <= activeUntil;
  });

  const currentEvent =
    currentEventIndex === -1 ? undefined : todayEvents[currentEventIndex];
  const nextEvent =
    currentEventIndex === -1 ? undefined : todayEvents[currentEventIndex + 1];

  return (
    <div className="w-full">
      <div className="grid grid-cols-12 gap-4">
        {/* Yesterday sidebar */}
        <div className="col-span-2 border-r pr-2">
          <EventList
            events={events.yesterday}
            isCompact={true}
            showTitle={true}
            title="Yesterday"
          />
        </div>

        {/* Today timeline */}
        <div className="col-span-8">
          <div className="text-muted-foreground mb-2 text-center text-sm font-medium">
            Today
          </div>
          <EventList
            currentEvent={currentEvent}
            events={todayEvents}
            nextEvent={nextEvent}
          />
        </div>

        {/* Tomorrow sidebar */}
        <div className="col-span-2 border-l pl-2">
          <EventList
            events={events.tomorrow}
            isCompact={true}
            showTitle={true}
            title="Tomorrow"
          />
        </div>
      </div>
    </div>
  );
};
