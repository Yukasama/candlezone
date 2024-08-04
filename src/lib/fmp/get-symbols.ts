import { appConfig } from '@/config/app'
import { FMP_URLS } from '@/config/fmp'
import { isSymbolValid } from '@/utils/stock-helper'
import 'server-only'

interface ListedSymbol {
  symbol: string
  name: string
  price: number
  exchange: string
  exchangeShortName: string
  type: string
}

export const getSymbols = async () => {
  if (appConfig.fmp.simulation) {
    return ['AAPL', 'MSFT', 'GOOG', 'TSLA', 'NVDA', 'META']
  }

  const data: ListedSymbol[] = await fetch(FMP_URLS.All, {
    cache: 'no-store',
  }).then((res) => res.json())

  return data
    .filter(
      (stock) =>
        isSymbolValid(stock.symbol) &&
        !!stock.name &&
        !!stock.price &&
        stock.type !== 'trust',
    )
    .map((stock) => stock.symbol)
}
