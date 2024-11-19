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
    marketDate = subDays(
      marketDate,
      now.getDay() === 0 ? 2 : now.getDay() === 1 ? 3 : 1,
    );
  }

  return setHours(setMinutes(marketDate, 29), 9);
}

export const getIndexes = async ({ symbols }: Props) => {
  const dateMap = new Map<number, Map<string, number>>();
  const startingPrices: { [symbol: string]: number } = {};

  const marketOpenTime = getMarketOpenTime();

  const histories = await Promise.all(
    symbols.map(async (symbol) => {
      const history = await getHistory({ symbol, timeframe: '1D' });
      return { symbol, history };
    }),
  );

  for (const { symbol, history } of histories) {
    if (!history?.length) {
      continue;
    }

    let startPriceSet = false;

    for (const { date, close } of history) {
      if (close == null || close === 0) {
        continue;
      }

      const dateObj = parseISO(date);

      if (isAfter(dateObj, marketOpenTime)) {
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
    }
  }

  const allTimestamps = Array.from(dateMap.keys()).sort((a, b) => a - b);

  const results = [];

  for (const timestamp of allTimestamps) {
    const symbolData = dateMap.get(timestamp)!;
    if (symbolData.size <= 1) {
      continue;
    }

    const date = format(timestamp, 'HH:mm');
    const result: { [key: string]: number | null | string } = { date };

    for (const symbol of symbols) {
      const startPrice = startingPrices[symbol];
      const currentPrice = symbolData.get(symbol);

      if (startPrice != null && currentPrice != null) {
        result[symbol] = ((currentPrice - startPrice) / startPrice) * 100;
      } else {
        result[symbol] = null;
      }
    }

    results.push(result);
  }

  logger.debug('getIndexes (done): length=%s', results.length);

  return results;
};
