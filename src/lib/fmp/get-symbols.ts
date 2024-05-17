import 'server-only'
import { FMP, FMP_URLS } from '@/config/fmp/config'
import { ListedSymbol } from '@/types/stock'

export const getSymbols = async () => {
  if (FMP.simulation) {
    return ['AAPL', 'MSFT', 'GOOG', 'TSLA', 'NVDA', 'META']
  }

  const data: ListedSymbol[] = await fetch(FMP_URLS['All'], {
    cache: 'no-cache',
  }).then((res) => res.json())

  return data
    .filter(
      (stock) => stock.exchange !== 'EURONEXT' && !stock.symbol.includes('.')
    )
    .map((stock) => stock.symbol)
}
