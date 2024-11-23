'use server';

import { getHistory } from '@/features/stock/actions/get-history';
import { logger } from '@/lib/logger';
import {
  format,
  isAfter,
  parseISO,
  setHours,
  setMinutes,
  startOfDay,
  subDays,
} from 'date-fns';

interface Props {
  symbols: string[];
}

function getMarketOpenTime() {
  const now = new Date();
  let marketDate = startOfDay(now);

  if (
    now.getHours() < 9 ||
    (now.getHours() === 9 && now.getMinutes() < 30) ||
    now.getDay() === 0 ||
    (now.getDay() === 1 &&
      (now.getHours() < 9 || (now.getHours() === 9 && now.getMinutes() < 30)))
  ) {
    const daysToSubtract = now.getDay() === 0 ? 2 : now.getDay() === 1 ? 3 : 1;
    marketDate = subDays(marketDate, daysToSubtract);
  }

  return setHours(setMinutes(marketDate, 30), 9);
}

export const getIndexes = async ({ symbols }: Props) => {
  const dateMap = new Map<number, Map<string, number>>();
  const startingPrices: Record<string, number> = {};

  const marketOpenTime = getMarketOpenTime();

  const histories = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const history = await getHistory({ symbol, timeframe: '1D' });
        return { symbol, history };
      } catch (error) {
        logger.error('Error fetching history for symbol %s: %s', symbol, error);
        return { symbol, history: [] };
      }
    }),
  );

  for (const { symbol, history } of histories) {
    if (!history?.length) {
      logger.warn('No history data available for symbol %s', symbol);
      continue;
    }

    let startPriceSet = false;

    for (const { date, close } of history) {
      if (!close) {
        continue;
      }

      const dateObj = parseISO(date);

      if (!isAfter(dateObj, marketOpenTime)) {
        continue;
      }

      if (!startPriceSet) {
        startingPrices[symbol] = close;
        startPriceSet = true;
      }

      const timestamp = dateObj.getTime();

      if (!dateMap.has(timestamp)) {
        dateMap.set(timestamp, new Map<string, number>());
      }
      dateMap.get(timestamp)!.set(symbol, close);
    }

    if (!startPriceSet) {
      logger.warn('No valid starting price found for symbol %s', symbol);
    }
  }

  const allTimestamps = [...dateMap.keys()].sort((a, b) => a - b);

  const results = [];

  for (const timestamp of allTimestamps) {
    const symbolData = dateMap.get(timestamp)!;
    if (symbolData.size <= 1) {
      continue;
    }

    const date = format(timestamp, 'HH:mm');
    const result: Record<string, number | undefined | string> = { date };

    for (const symbol of symbols) {
      const startPrice = startingPrices[symbol];
      const currentPrice = symbolData.get(symbol);

      result[symbol] =
        startPrice && currentPrice
          ? ((currentPrice - startPrice) / startPrice) * 100
          : undefined;
    }

    results.push(result);
  }

  logger.debug('getIndexes (done): length=%s', results.length);

  return results;
};
