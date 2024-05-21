import { useQuery } from '@tanstack/react-query'
import { getHistory } from '@/actions/stock/get-history'
import { useMemo } from 'react'
import { computeDomain, getFormattedDate } from '@/utils/chart-helper'

interface Props {
  symbol: string
  timeframe: '1D' | '5D' | '1M' | '6M' | '1Y' | '5Y' | 'All'
}

export const useStockHistory = ({ symbol, timeframe }: Readonly<Props>) => {
  const { data, refetch, isFetched } = useQuery({
    queryFn: async () => await getHistory({ symbol, timeframe }),
    queryKey: ['stock-history', timeframe, symbol],
    staleTime: 60 * 1000,
  })

  const chartData = useMemo(() => {
    if (isFetched && data?.length) {
      const domain = computeDomain(data)
      const startPrice = Number(data[0].close)
      const endPrice = Number(data[data.length - 1].close)
      const positive = endPrice >= startPrice

      const formattedData = data.map((item) => ({
        date: getFormattedDate(item.date, timeframe),
        close: item.close,
      }))

      return {
        domain,
        startPrice,
        positive,
        results: formattedData,
      }
    }
  }, [isFetched, data, timeframe])

  return { chartData, refetch, isFetched }
}
