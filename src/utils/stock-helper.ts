import { Quote } from '@/types/stock'

export const isSymbolValid = (symbol?: string) => {
  const germanRegex = /^[a-zA-Z]{1,4}\.DE$/
  const genericRegex = /^[a-zA-Z]{1,5}$/

  return germanRegex.test(symbol ?? '') || genericRegex.test(symbol ?? '')
}

export const formatMarketCap = (value?: number, isEUR?: boolean) => {
  const formatter = new Intl.NumberFormat(isEUR ? 'de-DE' : 'en-US', {
    style: 'currency',
    currency: isEUR ? 'EUR' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return formatter.format(value ?? 0)
}

export const getQuoteBySymbol = ({
  quotes,
  symbol,
}: {
  quotes: Quote[]
  symbol: string
}) => {
  quotes.find((quote) => quote.symbol === symbol)
}
