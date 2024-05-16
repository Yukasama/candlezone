import 'server-only'

import { env } from '@/env.mjs'

export const FMP = {
  docsPerPull: 1200,
  simulation: false,
}

export const FMP_API_URL = 'https://financialmodelingprep.com/api/'

export const FMP_URLS = {
  All: `${FMP_API_URL}v3/stock/list?apikey=${env.FMP_API_KEY}`,
  actives: `${FMP_API_URL}v3/stock_market/actives?apikey=${env.FMP_API_KEY}`,
  winners: `${FMP_API_URL}v3/stock_market/gainers?apikey=${env.FMP_API_KEY}`,
  losers: `${FMP_API_URL}v3/stock_market/losers?apikey=${env.FMP_API_KEY}`,
  indexQuotes: `${FMP_API_URL}v3/quotes/index?apikey=${env.FMP_API_KEY}`,
}

const fullHistoryUrl = 'historical-price-full'

export const TIMEFRAMES: Record<
  string,
  {
    url: string
    limit: number
  }
> = {
  '1D': { url: 'historical-chart/1min', limit: 392 },
  '5D': { url: 'historical-chart/5min', limit: 395 },
  '1M': { url: 'historical-chart/15min', limit: 575 },
  '6M': { url: fullHistoryUrl, limit: 126 },
  '1Y': { url: fullHistoryUrl, limit: 252 },
  '5Y': { url: fullHistoryUrl, limit: 1500 },
  All: { url: fullHistoryUrl, limit: 12000 },
}
