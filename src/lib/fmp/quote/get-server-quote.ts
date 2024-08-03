'use server'

import { appConfig } from '@/config/app'
import { env } from '@/env.mjs'
import { Quote } from '@/types/stock'
import { QUOTE_SIMULATION } from '@/utils/simulation'
import { isSymbolValid } from '@/utils/stock-helper'

const config = appConfig.fmp

export const getServerQuote = async (symbol?: string, allFields?: boolean) => {
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
