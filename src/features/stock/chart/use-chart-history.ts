import { Timeframe } from '@/lib/fmp/types/history';
import { computeDomain, getFormattedDate } from '@/lib/utils/chart-helper';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getHistory } from '../actions/get-history';

interface Props {
  symbol: string;
  timeframe: Timeframe;
}

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
