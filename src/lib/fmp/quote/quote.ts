import 'server-only'
import { FMP_API_URL, FMP } from '@/config/fmp/config'
import {
  AFTER_HOURS_QUOTE_SIMULATION,
  QUOTE_SIMULATION,
} from '@/config/fmp/simulation'
import { env } from '@/env.mjs'
import { AfterHoursQuote, Quote } from '@/types/stock'
import { Stock } from '@prisma/client'
import { isSymbolValid } from '@/utils/utils'

export const getQuote = async (symbol?: string, allFields?: boolean) => {
  if (FMP.simulation) {
    return QUOTE_SIMULATION
  }

  if (!isSymbolValid(symbol)) {
    return undefined
  }

  const url = `${FMP_API_URL}v3/quote/${symbol}?apikey=${env.FMP_API_KEY}`

  // Quote comes back as array
  const data = (
    await fetch(url, { next: { revalidate: 5 } }).then((res) => res.json())
  )[0] as Quote

  if (!data) {
    return undefined
  }

  if (allFields) {
    return data
  }

  return {
    symbol: data.symbol,
    name: data.name,
    price: data.price,
    changesPercentage: data.changesPercentage,
    pe: data.pe,
    eps: data.eps,
  }
}

export const getQuotes = async (symbols?: string[], allFields?: boolean) => {
  if (FMP.simulation) {
    return [
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
    ]
  }

  if (!symbols) {
    return undefined
  }

  const url = `${FMP_API_URL}v3/quote/${symbols.join(',')}?apikey=${
    env.FMP_API_KEY
  }`

  const data = (await fetch(url, { next: { revalidate: 5 } }).then((res) =>
    res.json()
  )) as Quote[]

  if (!data) {
    return undefined
  }

  if (allFields) {
    return data
  }

  return data?.map((d) => {
    return {
      symbol: d.symbol,
      name: d.name,
      price: d.price,
      changesPercentage: d.changesPercentage,
      pe: d.pe,
      eps: d.eps,
    }
  })
}

export const getAfterHoursQuote = async (symbol?: string) => {
  if (FMP.simulation) {
    return AFTER_HOURS_QUOTE_SIMULATION
  }

  if (!symbol) {
    return undefined
  }

  const url = `${FMP_API_URL}v4/pre-post-market-trade/${symbol}?apikey=${env.FMP_API_KEY}`

  const data: AfterHoursQuote = await fetch(url, {
    next: { revalidate: 30 },
  }).then((res) => res.json())

  if (!data) {
    return undefined
  }

  return {
    symbol: data.symbol,
    price: data.price,
  } as AfterHoursQuote
}

export const getStockQuotes = async (
  stocks: Pick<Stock, 'symbol' | 'companyName'>[]
) => {
  const quotes = await getQuotes(stocks.map((stock) => stock.symbol))

  return stocks.map((stock) => ({
    ...stock,
    ...quotes?.find((q) => q.symbol === stock.symbol)!,
  }))
}
