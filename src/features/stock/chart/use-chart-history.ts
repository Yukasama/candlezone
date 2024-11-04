import { History, Timeframe } from '@/lib/fmp/types/history';
import { getFormattedDate } from '@/lib/utils/date-helpers';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getHistory } from '../actions/get-history';

interface Props {
  symbol: string;
  timeframe: Timeframe;
}

const computeDomain = (
  data: Pick<History, 'date' | 'close'>[],
): [number, number] => {
  const values = data.map((item) => item.close);
  const dataMax = Math.max(...values);
  const dataMin = Math.min(...values);
  const padding = (dataMax - dataMin) * 0.15;

  return [dataMin - padding, dataMax + padding];
};

export const useChartHistory = ({ symbol, timeframe }: Readonly<Props>) => {
  const { data, refetch, isFetched } = useQuery({
    queryFn: async () => await getHistory({ symbol, timeframe }),
    queryKey: ['stock-history', timeframe, symbol],
    staleTime: 60 * 1000,
  });

  const chartData = useMemo(() => {
    if (isFetched && data?.length) {
      const domain = computeDomain(data);
      const startPrice = Number(data[0].close);
      const endPrice = Number(data.at(-1)?.close);
      const positive = endPrice >= startPrice;

      const formattedData = data.map((item) => ({
        date: getFormattedDate(item.date, timeframe),
        close: item.close,
      }));

      return {
        domain,
        startPrice,
        positive,
        results: formattedData,
      };
    }
  }, [isFetched, data, timeframe]);

  return { chartData, refetch, isFetched };
};
