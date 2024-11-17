// src/features/home/actions/get-indexes.ts

import { getHistory } from '@/features/stock/actions/get-history';

interface Props {
  symbols: string[];
}

interface MergedDataEntry {
  date: string;
  values: { [symbol: string]: number | null };
}

export const getIndexes = async ({
  symbols,
}: Props): Promise<MergedDataEntry[]> => {
  // Fetch all symbol data in parallel
  const symbolDataArray = await Promise.all(
    symbols.map(async (symbol) => {
      const history = await getHistory({
        symbol,
        timeframe: '1D',
      });
      return { symbol, history };
    }),
  );

  // Create efficient lookup maps
  const symbolDataMap: { [symbol: string]: { [date: string]: number } } = {};
  const allDatesSet = new Set<string>();

  // Process all data in a single pass
  symbolDataArray.forEach(({ symbol, history }) => {
    const dataMap: { [date: string]: number } = {};
    history?.forEach((dataPoint) => {
      dataMap[dataPoint.date] = dataPoint.close;
      allDatesSet.add(dataPoint.date);
    });
    symbolDataMap[symbol] = dataMap;
  });

  // Sort dates once
  const allDates = Array.from(allDatesSet).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  // Calculate starting values for percentage changes
  const startingValues = new Map<string, number>();
  symbols.forEach((symbol) => {
    const dates = Object.keys(symbolDataMap[symbol]);
    const earliestDate = dates.toSorted(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    )[0];
    startingValues.set(symbol, symbolDataMap[symbol][earliestDate]);
  });

  // Generate merged data with percentage changes
  const results = allDates.map((date) => {
    const values: { [symbol: string]: number | null } = {};
    symbols.forEach((symbol) => {
      const value = symbolDataMap[symbol][date];
      const startValue = startingValues.get(symbol);
      if (value !== undefined && startValue && startValue !== 0) {
        const percentageChange = ((value - startValue) / startValue) * 100;
        values[symbol] = percentageChange;
      } else {
        values[symbol] = null;
      }
    });
    return { date, values };
  });

  return results?.map(({ date, values }) => ({ date, ...values }));
};
