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
import { EconomicEvent } from '@/lib/fmp/types/info';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import { isActualGood } from './lib/is-actual-good';

export const metadata = { title: 'Economic Calendar' };

interface Props {
  events: EconomicEvent[];
}

const impactColors = {
  None: 'bg-gray-200 text-gray-800',
  Low: 'bg-emerald-500 text-white',
  Medium: 'bg-amber-600 text-white',
  High: 'bg-red-600 text-white',
};

export const EconomicCalendar = ({ events }: Props) => {
  const [impactLevel, setImpactLevel] = useState('Medium');

  const filteredEvents = events.filter(({ impact }) =>
    filterEventsByImpact(impactLevel, impact),
  );

  const groupedEvents: Record<
    string,
    Record<string, EconomicEvent[] | undefined> | undefined
  > = {};

  for (const event of filteredEvents) {
    const eventDate = new Date(event.date);
    const day = eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
    const time = eventDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (!groupedEvents[day]) {
      groupedEvents[day] = {};
    }

    if (!groupedEvents[day][time]) {
      groupedEvents[day][time] = [];
    }

    groupedEvents[day][time].push(event);
  }

  const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <PageLayout className="f-col gap-4">
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
                <div className="f-center justify-between pr-3">
                  <div className="flex-1 py-3 text-lg font-semibold lg:text-xl">
                    {dayOfWeek}
                  </div>
                </div>
                <p className="text-center text-gray-500">
                  No events for {dayOfWeek}
                </p>
              </div>
            );
          }

          const times = Object.keys(groupedEvents[dayKey]).sort((a, b) =>
            a.localeCompare(b),
          );

          return (
            <div key={dayKey}>
              <div className="f-center justify-between pr-5">
                <div className="flex-1 py-3 text-lg font-semibold lg:text-xl">
                  {dayKey}
                </div>
                <div className="flex w-12 translate-y-9 justify-center text-gray-500 sm:w-20">
                  <p className="lg:hidden">Prev:</p>
                  <p className="hidden lg:flex">Previous</p>
                </div>
                <div className="flex w-12 translate-y-9 justify-center text-gray-500 sm:w-20">
                  <p className="lg:hidden">Est:</p>
                  <p className="hidden lg:flex">Estimate</p>
                </div>
                <div className="flex w-12 translate-y-9 justify-center text-gray-500 sm:w-20">
                  <p className="lg:hidden">Act:</p>
                  <p className="hidden lg:flex">Actual</p>
                </div>
              </div>

              {times.map((time) => (
                <div key={time} className="mb-3">
                  <div className="mb-2 text-gray-500">{time}</div>
                  <div className="f-col ml-2 gap-1 border-l px-2">
                    {groupedEvents[dayKey][time].map(
                      (
                        {
                          date,
                          country,
                          event,
                          impact,
                          previous,
                          estimate,
                          actual,
                        },
                        i,
                      ) => {
                        const isGood = isActualGood({ actual, estimate, event })
                          ? 'text-emerald-500'
                          : 'text-red-500';

                        return (
                          <Card
                            key={date + String(i)}
                            className="rounded-lg bg-gray-100 p-1 px-3 dark:bg-gray-900"
                          >
                            <div className="f-center justify-between">
                              <div className="f-center flex-1 gap-4">
                                <Image
                                  src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${
                                    country === 'UK'
                                      ? 'GB'
                                      : country.toUpperCase()
                                  }.svg`}
                                  width={40}
                                  height={30}
                                  alt={country}
                                  className="w-8 rounded-sm object-contain lg:w-10"
                                />
                                <div>
                                  <p className="w-[200px] truncate text-sm font-semibold lg:w-full lg:text-[15px]">
                                    {event}
                                  </p>
                                  <div className="f-center gap-2">
                                    <div
                                      className={`f-box h-[18px] rounded-full px-2 text-xs font-semibold ${
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
