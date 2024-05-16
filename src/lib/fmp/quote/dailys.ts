import { FMP, FMP_URLS } from '@/config/fmp/config'
import { QUOTE_SIMULATION } from '@/config/fmp/simulation'
import { Quote } from '@/types/stock'

export const getDailys = async (action: 'actives' | 'winners' | 'losers') => {
  if (FMP.simulation) {
    return [
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
    ]
  }

  const response = await fetch(FMP_URLS[action], {
    next: { revalidate: 30 },
  }).then((res) => res.json())

  // Filtering all none-ETFs and stocks with "-" in their symbol
  return response.filter(
    (item: Quote) =>
      item.name &&
      !item.symbol.includes('-') &&
      !item.name.includes('ProShares')
  )
}
