import { fetchHistory } from '../fmp/history/fetch-history';

export const getTar = async (symbol: string) => {
  const data = await fetchHistory({ symbol, timeframe: '1Y' });
  if (!data) {
    return;
  }

  const close: number[] = data.map(({ close }) => close);

  return close.pop() ?? 0 / close[0];
};
