import 'server-only'
import {
  AFTER_HOURS_QUOTE_SIMULATION,
  QUOTE_SIMULATION,
} from '@/utils/simulation'
import { env } from '@/env.mjs'
import { AfterHoursQuote, Quote } from '@/types/stock'
import { Stock } from '@prisma/client'
import { isSymbolValid } from '@/utils/stock-helper'
import { appConfig } from '@/config/app'

const config = appConfig.fmp

export const getQuote = async (symbol?: string, allFields?: boolean) => {
  if (config.simulation) {
    return QUOTE_SIMULATION
  }

  if (!isSymbolValid(symbol)) {
    return
  }

  const url = `${config.url}v3/quote/${symbol}?apikey=${env.FMP_API_KEY}`

  try {
    const data: Quote = (
      await fetch(url, { next: { revalidate: 5 } }).then((res) => res.json())
    )[0]

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
  } catch {
    return
  }
}

export const getQuotes = async (symbols: string[], allFields?: boolean) => {
  if (config.simulation) {
    return [
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
    ]
  }

  if (!symbols) {
    return
  }

  const url = `${config.url}v3/quote/${symbols.join(',')}?apikey=${
    env.FMP_API_KEY
  }`

  try {
    const data: Quote[] = await fetch(url, { next: { revalidate: 5 } }).then(
      (res) => res.json()
    )

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
  } catch {
    return
  }
}

export const getAfterHoursQuote = async (symbol: string) => {
  if (config.simulation) {
    return AFTER_HOURS_QUOTE_SIMULATION
  }

  const url = `${config.url}v4/pre-post-market-trade/${symbol}?apikey=${env.FMP_API_KEY}`

  try {
    const data: AfterHoursQuote = await fetch(url, {
      next: { revalidate: 30 },
    }).then((res) => res.json())

    return {
      symbol: data.symbol,
      price: data.price,
    } as AfterHoursQuote
  } catch {
    return
  }
}

type RequiredStockFields = Pick<Stock, 'id' | 'symbol' | 'companyName'>

type StockWithAdditionalFields = RequiredStockFields &
  Partial<Omit<Stock, keyof RequiredStockFields>>

export const getStockQuotes = async (stocks: StockWithAdditionalFields[]) => {
  const quotes = await getQuotes(stocks.map((stock) => stock.symbol))

  return stocks.map((stock) => ({
    ...stock,
    ...quotes?.find((q) => q.symbol === stock.symbol)!,
  }))
}
