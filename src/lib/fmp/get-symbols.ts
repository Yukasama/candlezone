import { appConfig } from '@/config/app'
import { FMP_URLS } from '@/config/fmp'
import { ListedSymbol } from '@/types/stock'
import { isSymbolValid } from '@/utils/stock-helper'
import 'server-only'

export const getSymbols = async () => {
  if (appConfig.fmp.simulation) {
    return ['AAPL', 'MSFT', 'GOOG', 'TSLA', 'NVDA', 'META']
  }

  const data: ListedSymbol[] = await fetch(FMP_URLS['All'], {
    cache: 'no-store',
  }).then((res) => res.json())

  return data
    .filter(
      (stock) =>
        isSymbolValid(stock.symbol) &&
        !!stock.name &&
        !!stock.price &&
        stock.type !== 'trust'
    )
    .map((stock) => stock.symbol)
}
