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
import { EconomicEvent } from '@/features/stock/types/stock';
import Image from 'next/image';
import { useState } from 'react';

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

  const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);

  const filterEventsByImpact = (impact: string, eventImpact: string) => {
    if (impact === 'High') {
      return eventImpact === 'High';
    } else if (impact === 'Medium') {
      return eventImpact === 'High' || eventImpact === 'Medium';
    } else if (impact === 'Low') {
      return eventImpact !== 'None';
    }
    return false;
  };

  return (
    <PageLayout className="f-col gap-4">
      <Select defaultValue={impactLevel} onValueChange={setImpactLevel}>
        <div>
          <Label>Impact</Label>
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

      {orderedDays.map((day) => {
        const dayDate = getDateForDayOfWeek(day, startOfWeek);
        const dayEvents = events
          .filter(
            (event) =>
              getDayOfWeek(event.date) === day &&
              event.country === 'US' &&
              filterEventsByImpact(impactLevel, event.impact),
          )
          .reverse();

        return (
          <div key={day}>
            <div className="f-center justify-between">
              <div className="flex-1 py-3 text-lg font-semibold lg:text-xl">
                {`${day} - ${dayDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}`}
              </div>

              <span className="w-10 text-gray-400 sm:w-20">Est:</span>
              <span className="w-10 text-gray-400 sm:w-20">Act:</span>
            </div>

            <div className="f-col gap-1.5">
              {dayEvents.length > 0 ? (
                dayEvents.map((event, index) => (
                  <Card key={index} className="rounded-lg bg-gray-900 p-1 px-3">
                    <div className="f-center justify-between">
                      <div className="f-center flex-1 gap-4">
                        <Image
                          src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${event.country?.toUpperCase() || 'US'}.svg`}
                          width={40}
                          height={30}
                          alt={`${event.country || 'Unknown'}`}
                          className="w-8 rounded-sm object-contain lg:w-10"
                        />
                        <div>
                          <p className="w-[240px] truncate text-sm font-semibold sm:w-full lg:text-[15px]">
                            {event.event || 'N/A'}
                          </p>
                          <div className="f-center gap-2">
                            <p className="text-sm text-gray-400">
                              {new Date(event.date).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            <div
                              className={`f-box h-[18px] rounded-full px-2 text-xs font-semibold ${impactColors[event.impact] || impactColors.None}`}
                            >
                              {event.impact || 'None'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="w-10 sm:w-20">
                          {event.estimate ?? '-'}
                        </div>
                        <div className="w-10 sm:w-20">
                          {event.actual ?? '-'}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500">No events for {day}</p>
              )}
            </div>
          </div>
        );
      })}
    </PageLayout>
  );
};
