import { appConfig } from '@/config/app'
import { FMP_URLS } from '@/config/fmp'
import { QUOTE_SIMULATION } from '@/utils/simulation'
import { Quote } from '@/types/stock'
import { isSymbolValid } from '@/utils/stock-helper'

export const getDailys = async (action: 'actives' | 'winners' | 'losers') => {
  if (appConfig.fmp.simulation) {
    return [
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
    ]
  }

  try {
    const response: Quote[] = await fetch(FMP_URLS[action], {
      cache: 'force-cache',
    }).then((res) => res.json())

    return response.filter((stock) => isSymbolValid(stock.symbol)).slice(0, 6)
  } catch {
    return []
  }
}
