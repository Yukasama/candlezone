'use server';

import { getHistory } from '@/features/stock/actions/get-history';
import { logger } from '@/lib/logger';
import { format, parseISO } from 'date-fns';

interface Props {
  symbols: string[];
}

export const getIndexes = async ({ symbols }: Props) => {
  const dateMap = new Map<number, Map<string, number>>();
  const startingPrices: Record<string, number> = {};

  const histories = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const history = await getHistory({ symbol, timeframe: '1D' });
        return { history, symbol };
      } catch (error) {
        logger.debug('Error fetching history for symbol %s: %s', symbol, error);
        return { history: [], symbol };
      }
    }),
  );

  for (const { history, symbol } of histories) {
    if (!history?.length) {
      logger.debug('No history data available for symbol %s', symbol);
      continue;
    }

    let startPriceSet = false;
    for (const { close, date } of history) {
      if (!close) {
        continue;
      }

      const dateObj = parseISO(date);
      if (!startPriceSet) {
        startingPrices[symbol] = close;
        startPriceSet = true;
      }

      const timestamp = dateObj.getTime();
      if (!dateMap.has(timestamp)) {
        dateMap.set(timestamp, new Map<string, number>());
      }
      dateMap.get(timestamp)?.set(symbol, close);
    }

    if (!startPriceSet) {
      logger.debug('No valid starting price found for symbol %s', symbol);
    }
  }

  const allTimestamps = [...dateMap.keys()].sort((a, b) => a - b);

  const results = [];
  for (const timestamp of allTimestamps) {
    const symbolData = dateMap.get(timestamp);
    if ((symbolData?.size ?? 0) <= 1) {
      continue;
    }

    const date = format(timestamp, 'HH:mm');
    const result: Record<string, number | string | undefined> = { date };

    for (const symbol of symbols) {
      const startPrice = startingPrices[symbol];
      const currentPrice = symbolData?.get(symbol);

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
