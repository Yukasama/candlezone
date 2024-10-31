import { appConfig } from '@/config/app';
import { env } from '@/env.mjs';
import { EconomicEvent } from '@/features/stock/types/stock';
import { addDays, format, startOfWeek } from 'date-fns';

const fmpConfig = appConfig.fmp;

export const getEconomicCalendar = async () => {
  const today = new Date();

  const isWeekend = today.getDay() === 6 || today.getDay() === 0;
  const startOfWeekDate = isWeekend
    ? addDays(startOfWeek(today, { weekStartsOn: 1 }), 7)
    : startOfWeek(today, { weekStartsOn: 1 });
  const endOfWeekDate = addDays(startOfWeekDate, 4);

  const formatDate = (date: Date): string => format(date, 'yyyy-MM-dd');

  return await fetch(
    `${fmpConfig.url}v3/economic_calendar?from=${formatDate(startOfWeekDate)}&to=${formatDate(endOfWeekDate)}&apikey=${env.FMP_API_KEY}`,
  ).then((res) => res.json() as Promise<EconomicEvent[]>);
};
