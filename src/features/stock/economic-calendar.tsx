'use client';

import { PageLayout } from '@/components/page-layout';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { filterEventsByImpact } from '@/features/stock/config/filter-events-by-impact';
import { EconomicCalendarItem } from '@/lib/fmp/types/info';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import { isActualGood } from './lib/is-actual-good';

interface Props {
  events: EconomicCalendarItem[];
}

const impactColors = {
  High: 'bg-destructive text-white',
  Low: 'bg-success text-white',
  Medium: 'bg-amber-600 text-white',
  None: 'bg-secondary text-secondary-foreground',
};

export const EconomicCalendar = ({ events }: Props) => {
  const [impactLevel, setImpactLevel] = useState('Medium');

  const filteredEvents = events.filter(({ impact }) =>
    filterEventsByImpact(impactLevel, impact),
  );

  const groupedEvents: Record<
    string,
    Record<string, EconomicCalendarItem[] | undefined> | undefined
  > = {};

  for (const event of filteredEvents) {
    const eventDate = new Date(event.date);
    const day = eventDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      weekday: 'long',
    });
    const time = eventDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    groupedEvents[day] ??= {};
    groupedEvents[day][time] ??= [];
    groupedEvents[day][time].push(event);
  }

  const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <PageLayout className="flex flex-col gap-4">
      <Select defaultValue={impactLevel} onValueChange={setImpactLevel}>
        <div>
          <Label className="ml-1">Impact</Label>
          <SelectTrigger className="w-[180px]">
            <SelectValue>{impactLevel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </div>
      </Select>

      <div>
        {orderedDays.map((dayOfWeek) => {
          const dayKey = Object.keys(groupedEvents).find((day) =>
            day.startsWith(dayOfWeek),
          );

          if (!dayKey) {
            return (
              <div key={dayOfWeek}>
                <div className="flex items-center justify-between pr-3">
                  <div className="flex-1 py-3 text-lg font-semibold lg:text-xl">
                    {dayOfWeek}
                  </div>
                </div>
                <p className="text-desc text-center">
                  No events for {dayOfWeek}
                </p>
              </div>
            );
          }

          const times = Object.keys(groupedEvents[dayKey] ?? {}).sort((a, b) =>
            a.localeCompare(b),
          );

          return (
            <div key={dayKey}>
              <div className="flex items-center justify-between pr-5">
                <div className="flex-1 py-3 text-lg font-semibold lg:text-xl">
                  {dayKey}
                </div>
                <div className="text-desc flex w-12 translate-y-9 justify-center sm:w-20">
                  <p className="lg:hidden">Prev:</p>
                  <p className="hidden lg:flex">Previous</p>
                </div>
                <div className="text-desc flex w-12 translate-y-9 justify-center sm:w-20">
                  <p className="lg:hidden">Est:</p>
                  <p className="hidden lg:flex">Estimate</p>
                </div>
                <div className="text-desc flex w-12 translate-y-9 justify-center sm:w-20">
                  <p className="lg:hidden">Act:</p>
                  <p className="hidden lg:flex">Actual</p>
                </div>
              </div>

              {times.map((time) => (
                <div className="mb-3" key={time}>
                  <div className="text-desc mb-2">{time}</div>
                  <div className="ml-2 flex flex-col gap-1 border-l px-2">
                    {groupedEvents[dayKey]?.[time]?.map(
                      (
                        {
                          actual,
                          country,
                          date,
                          estimate,
                          event,
                          impact,
                          previous,
                        },
                        i,
                      ) => {
                        const isGood = isActualGood({ actual, estimate, event })
                          ? 'text-success'
                          : 'text-destructive';

                        return (
                          <Card
                            className="bg-faded rounded-lg p-1 px-3"
                            key={date + String(i)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex flex-1 items-center gap-4">
                                <Image
                                  alt={country}
                                  className="w-8 rounded-sm object-contain lg:w-10"
                                  height={30}
                                  src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${
                                    country === 'UK'
                                      ? 'GB'
                                      : country.toUpperCase()
                                  }.svg`}
                                  width={40}
                                />
                                <div>
                                  <p className="w-[200px] truncate text-sm font-semibold lg:w-full lg:text-[15px]">
                                    {event}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`flex h-[18px] items-center justify-center rounded-full px-2 text-xs font-semibold ${
                                        impactColors[impact]
                                      }`}
                                    >
                                      {impact}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex text-center">
                                <div className="w-12 sm:w-20">
                                  {previous ?? '-'}
                                </div>
                                <div className="w-12 sm:w-20">
                                  {estimate ?? '-'}
                                </div>
                                <div
                                  className={cn(
                                    'w-12 sm:w-20',
                                    estimate && actual ? isGood : '',
                                  )}
                                >
                                  {actual ?? '-'}
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      },
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
};
