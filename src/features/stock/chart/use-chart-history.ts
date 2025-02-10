'use client';

import { History, Timeframe } from '@/lib/fmp/types/history';
import { getFormattedDate } from '@/lib/utils/date-helpers';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getHistory } from '../actions/get-history';

interface Props {
  symbol: string;
  timeframe: Timeframe;
}

export const computeDomain = (
  data: Pick<History, 'close' | 'date'>[],
): [number, number] => {
  const values = data.map(({ close }) => close);
  const dataMax = Math.max(...values);
  const dataMin = Math.min(...values);
  const padding = (dataMax - dataMin) * 0.15;

  return [dataMin - padding, dataMax + padding];
};

export const useChartHistory = ({ symbol, timeframe }: Readonly<Props>) => {
  const { data, isError, isLoading, refetch } = useQuery({
    queryFn: async () => await getHistory({ symbol, timeframe }),
    queryKey: ['stock-history', timeframe, symbol],
    staleTime: 60 * 1000,
  });

  const chartData = useMemo(() => {
    if (!isError && data) {
      const domain = computeDomain(data);
      const startPrice = Number(data.at(0)?.close);
      const endPrice = Number(data.at(-1)?.close);
      const positive = endPrice >= startPrice;

      const formattedData = data.map(({ close, date }) => ({
        close,
        date: getFormattedDate(date, timeframe),
      }));

      return {
        domain,
        positive,
        results: formattedData,
        startPrice,
      };
    }
  }, [data, timeframe, isError]);

  return { chartData, isError, isLoading, refetch };
};
