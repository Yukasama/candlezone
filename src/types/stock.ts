import { Stock } from '@prisma/client'

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
  price: number | null
  changesPercentage: number
  change?: number
  dayLow?: number
  dayHigh?: number
  yearHigh?: number
  yearLow?: number
  marketCap?: number
  priceAvg50?: number
  priceAvg200?: number
  exchange?: string | null
  volume?: number
  avgVolume?: number
  open?: number
  eps?: number
  pe?: number
  earningsAnnouncement?: string
  sharesOutstanding?: number
  timestamp?: number
}

export type MarketCapStock = {
  symbol: string
  companyName: string
  marketCap: number
  sector?: string
  industry?: string
  beta?: number
  price?: number
  lastAnnualDividend?: number
  volume?: number
  exchange?: string
  exchangeShortName?: string
  country?: string
  isEtf?: boolean
  isFund?: boolean
  isActivelyTrading?: boolean
}

export type Profile = {
  symbol: string
  price?: number
  beta?: number
  volAvg?: number
  mktCap?: number
  lastDiv?: number
  range?: string
  changes?: number
  companyName?: string
  currency?: string
  cik?: string
  isin?: string
  cusip?: string
  exchange?: string
  exchangeShortName?: string
  industry?: string
  website?: string
  description?: string
  ceo?: string
  sector?: string
  country?: string
  fullTimeEmployees?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  dcfDiff?: number
  dcf?: number
  image?: string
  ipoDate?: string
  defaultImage?: boolean
  isEtf?: boolean
  isActivelyTrading?: boolean
  isAdr?: boolean
  isFund?: boolean
}

export interface AfterHoursQuote {
  symbol: string
  price: number
}

export interface ListedSymbol {
  symbol: string
  name: string
  price: number
  exchange: string
  exchangeShortName: string
  type: string
}

export interface StockPeer {
  symbol: string
  peersList: string[]
}

export type StockQuote = Partial<Stock> & Pick<Stock, 'symbol'> & Partial<Quote>

export type MarketCapQuote = MarketCapStock & Partial<Quote>
