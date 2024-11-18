import { getHistory } from '@/features/stock/actions/get-history';
import { format } from 'date-fns';

interface Props {
  symbols: string[];
}

export const getIndexes = async ({ symbols }: Props) => {
  const dateMap: { [timestamp: number]: { [symbol: string]: number } } = {};
  const startingPrices: { [symbol: string]: number } = {};

  await Promise.all(
    symbols.map(async (symbol) => {
      const history = await getHistory({ symbol, timeframe: '1D' });
      if (!history?.length) {
        return;
      }

      let startPriceSet = false;

      for (const { date, close } of history) {
        if (close == null) {
          continue;
        }

        const timestamp = Date.parse(date);

        if (!startPriceSet && close !== 0) {
          startingPrices[symbol] = close;
          startPriceSet = true;
        }

        if (!dateMap[timestamp]) {
          dateMap[timestamp] = {};
        }
        dateMap[timestamp][symbol] = close;
      }
    }),
  );

  const allTimestamps = Object.keys(dateMap)
    .map(Number)
    .sort((a, b) => a - b);

  const results = [];

  for (const timestamp of allTimestamps) {
    const symbolData = dateMap[timestamp];

    const symbolsWithData = Object.keys(symbolData);
    if (symbolsWithData.length <= 1) {
      continue;
    }

    const date = format(timestamp, 'HH:mm');
    const result: { [key: string]: number | null | string } = { date };

    for (const symbol of symbols) {
      const startPrice = startingPrices[symbol];
      const currentPrice = symbolData[symbol];

      if (startPrice != null && currentPrice != null) {
        result[symbol] = ((currentPrice - startPrice) / startPrice) * 100;
      } else {
        result[symbol] = null;
      }
    }

    results.push(result);
  }

  return results;
};
