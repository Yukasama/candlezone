import { appConfig } from '@/config/app';
import { fmpClient } from '@/lib/axios';
import { DualHistory, History, Timeframe } from '@/lib/fmp/types/history';
import { logger } from '@/lib/logger';

const { historyUrl } = appConfig.fmp;

const TIMEFRAMES: Record<Timeframe, { limit: number; url: string }> = {
  '1D': { limit: 392, url: 'historical-chart/1min' },
  '1M': { limit: 575, url: 'historical-chart/15min' },
  '1Y': { limit: 252, url: historyUrl },
  '5D': { limit: 395, url: 'historical-chart/5min' },
  '5Y': { limit: 1500, url: historyUrl },
  '6M': { limit: 126, url: historyUrl },
  All: { limit: 12000, url: historyUrl },
};

interface Props {
  all?: boolean;
  from?: Date;
  symbol: string;
  timeframe: string;
}

/**
 * Fetch history of a stock
 * @param symbol Symbol of the stock
 * @param timeframe Type: `Timeframe`, e.g. 1D, 5D, 1M
 * @param from Optional Date from which to fetch the history
 * @param all Optional Flag to get entire OHLC + volume data
 * @returns History of the stock
 */
export const fetchHistory = async ({ all, from, symbol, timeframe }: Props) => {
  try {
    const { limit, url } = TIMEFRAMES[timeframe as Timeframe];

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

    return history.map(({ close, date }: History) => ({ close, date }));
  } catch (error) {
    if (error instanceof Error) {
      logger.debug('fetchHistory (error): %s', error.message);
    }
  }
};
