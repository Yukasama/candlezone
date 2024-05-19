import 'server-only'
import { FMP_URLS } from '@/config/fmp'
import { INDEXQUOTES_SIMULATION } from '@/utils/simulation'
import { Quote } from '@/types/stock'
import { appConfig } from '@/config/app'

export const getIndexQuotes = async (allFields?: boolean) => {
  if (appConfig.fmp.simulation) {
    return INDEXQUOTES_SIMULATION
  }

  const requiredIndexes = ['^GSPC', '^GDAXI', '^NDX', '^DJI']

  const data = await fetch(FMP_URLS['indexQuotes'], {
    next: { revalidate: 30 },
  }).then((res) => res.json())

  const results = data.filter((result: any) =>
    requiredIndexes.includes(result.symbol)
  ) as Quote[] | undefined

  if (allFields) {
    return results
  }

  return results?.map((res) => {
    return {
      symbol: res.symbol,
      name: res.name,
      price: res.price,
      changesPercentage: res.changesPercentage,
    }
  })
}
