import { appConfig } from '@/config/app';
import { env } from '@/env.mjs';
import { Earnings } from '@/features/stock/types/stock';
import { isSymbolValid } from '@/lib/utils/stock-helper';
import { addMonths, format } from 'date-fns';

const fmpConfig = appConfig.fmp;

export const getEarnings = async () => {
  const today = new Date();
  const threeMonthsLater = addMonths(today, 3);
  const formatDate = (date: Date): string => format(date, 'yyyy-MM-dd');

  const data = await fetch(
    `${fmpConfig.url}v3/earning_calendar?from=${formatDate(today)}&to=${formatDate(threeMonthsLater)}&apikey=${env.FMP_API_KEY}`,
  ).then((res) => res.json() as Promise<Earnings[]>);

  return data.filter((entry) => isSymbolValid(entry.symbol));
};
