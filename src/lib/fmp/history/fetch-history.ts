import { appConfig } from '@/config/app';
import { fmpClient } from '@/lib/axios';
import { DualHistory, History, Timeframe } from '@/lib/fmp/types/history';
import { logger } from '@/lib/logger';

const { historyUrl } = appConfig.fmp;

const TIMEFRAMES: Record<Timeframe, { url: string; limit: number }> = {
  '1D': { url: 'historical-chart/1min', limit: 392 },
  '5D': { url: 'historical-chart/5min', limit: 395 },
  '1M': { url: 'historical-chart/15min', limit: 575 },
  '6M': { url: historyUrl, limit: 126 },
  '1Y': { url: historyUrl, limit: 252 },
  '5Y': { url: historyUrl, limit: 1500 },
  All: { url: historyUrl, limit: 12000 },
};

interface Props {
  symbol: string;
  timeframe: string;
  from?: Date;
  all?: boolean;
}

/**
 * Fetch history of a stock
 * @param symbol Symbol of the stock
 * @param timeframe Type: `Timeframe`, e.g. 1D, 5D, 1M
 * @param from Optional Date from which to fetch the history
 * @param all Optional Flag to get entire OHLC + volume data
 * @returns History of the stock
 */
export const fetchHistory = async ({ symbol, timeframe, from, all }: Props) => {
  try {
    const { url, limit } = TIMEFRAMES[timeframe as Timeframe];

    const historyUrl = `v3/${url}/${symbol}?${String(
      url.includes('price-full')
        ? 'from=1975-01-01'
        : from && `from=${from.toDateString().split('T')[0]}`,
    )}`;

    const { data } = await fmpClient.get<DualHistory>(historyUrl);

    const isDaily = url.includes('price-full') && 'historical' in data;
    const result = isDaily ? data.historical : (data as History[]);
    const history = result.slice(0, Math.min(limit, result.length)).reverse();

    if (all) {
      return history;
    }

    return history.map(({ date, close }: History) => ({ date, close }));
  } catch (error) {
    if (error instanceof Error) {
      logger.debug('fetchHistory (error): %s', error.message);
    }
  }
};
