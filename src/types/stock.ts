import { getStockQuotes } from '@/lib/fmp/quote/quote'
import { Financials, Stock } from '@prisma/client'

export interface History {
  date: string
  open?: number
  high?: number
  low?: number
  close: number
  volume: number
  change?: number
  changePercent?: number
  vwap?: number
  label?: string
}

export interface Quote {
  symbol: string
  name: string
  price: number
  changesPercentage: number
  change?: number
  dayLow?: number
  dayHigh?: number
  yearHigh?: number
  yearLow?: number
  marketCap?: number
  priceAvg50?: number
  priceAvg200?: number
  exchange?: string
  volume?: number
  avgVolume?: number
  open?: number
  eps?: number
  pe?: number
  earningsAnnouncement?: string
  sharesOutstanding?: number
  timestamp?: number
}

export interface AfterHoursQuote {
  symbol: string
  price: number
}

export interface StockWithFinancials extends Stock {
  financials: Financials[]
}

export type StockQuote = Awaited<ReturnType<typeof getStockQuotes>>[0]

export interface ChartData {
  domain: [number, number]
  startPrice: number
  positive: boolean
  results: Pick<History, 'date' | 'close'>[]
}
