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
import { useHydration } from '@/lib/hooks/use-hydration';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Suspense, useState } from 'react';

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

const getDateForDayOfWeek = (dayOfWeek: string, startOfWeek: Date) => {
  const dayIndex = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ].indexOf(dayOfWeek);
  const date = new Date(startOfWeek);
  date.setDate(startOfWeek.getDate() + dayIndex);
  return date;
};

const getDayOfWeek = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

export const EconomicCalendar = ({ events }: Props) => {
  const [impactLevel, setImpactLevel] = useState('Medium');

  const hydrated = useHydration();

  const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);

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
        {orderedDays.map((day) => {
          const dayDate = getDateForDayOfWeek(day, startOfWeek);
          const dayEvents = events
            .filter(
              (event) =>
                getDayOfWeek(event.date) === day &&
                filterEventsByImpact(impactLevel, event.impact),
            )
            .reverse();

          return (
            <div key={day}>
              <div className="f-center justify-between pr-3">
                <div className="flex-1 py-3 text-lg font-semibold lg:text-xl">
                  <Suspense key={hydrated ? 'local' : 'utc'}>
                    <time dateTime={new Date(dayDate).toISOString()}>
                      {`${day} - ${dayDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}`}
                    </time>
                  </Suspense>
                </div>

                <div className="flex w-12 justify-center text-gray-400 sm:w-20">
                  <p className="lg:hidden">Est:</p>
                  <p className="hidden lg:flex">Estimate</p>
                </div>
                <div className="flex w-12 justify-center text-gray-400 sm:w-20">
                  <p className="lg:hidden">Act:</p>
                  <p className="hidden lg:flex">Actual</p>
                </div>
              </div>

              <div className="f-col gap-1.5">
                {dayEvents.length > 0 ? (
                  dayEvents.map(
                    ({ date, country, event, impact, estimate, actual }, i) => (
                      <Card
                        key={date + i}
                        className="rounded-lg bg-gray-900 p-1 px-3"
                      >
                        <div className="f-center justify-between">
                          <div className="f-center flex-1 gap-4">
                            <Image
                              src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country === 'UK' ? 'GB' : country?.toUpperCase()}.svg`}
                              width={40}
                              height={30}
                              alt={`${country || 'Unknown'}`}
                              className="w-8 rounded-sm object-contain lg:w-10"
                            />
                            <div>
                              <p className="w-[200px] truncate text-sm font-semibold lg:w-full lg:text-[15px]">
                                {event || 'N/A'}
                              </p>
                              <div className="f-center gap-2">
                                <Suspense key={hydrated ? 'local' : 'utc'}>
                                  <time dateTime={new Date(date).toISOString()}>
                                    {new Date(date).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </time>
                                  {hydrated ? '' : ' (UTC)'}
                                </Suspense>
                                <div
                                  className={`f-box h-[18px] rounded-full px-2 text-xs font-semibold ${impactColors[impact] || impactColors.None}`}
                                >
                                  {impact || 'None'}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="w-12 text-center sm:w-20">
                              {estimate ?? '-'}
                            </div>
                            <div
                              className={cn(
                                estimate && estimate !== 0 && actual
                                  ? (actual ?? 0) / estimate >= 1
                                    ? 'text-red-500'
                                    : 'text-emerald-500'
                                  : 'text-gray-500',
                                'w-12 text-center sm:w-20',
                              )}
                            >
                              {actual ?? '-'}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ),
                  )
                ) : (
                  <p className="text-center text-gray-500">
                    No events for {day}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
};
