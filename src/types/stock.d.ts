export interface History {
  date: string;
  open?: number;
  high?: number;
  low?: number;
  close: number;
  volume: number;
  change?: number;
  changePercent?: number;
  vwap?: number;
  label?: string;
}

export interface Quote {
  symbol: string;
  name: string;
  price: number | null;
  changesPercentage: number;
  change?: number;
  dayLow?: number;
  dayHigh?: number;
  yearHigh?: number;
  yearLow?: number;
  marketCap?: number;
  priceAvg50?: number;
  priceAvg200?: number;
  exchange?: string | null;
  volume?: number;
  avgVolume?: number;
  open?: number;
  eps?: number;
  pe?: number;
  earningsAnnouncement?: string;
  sharesOutstanding?: number;
  timestamp?: number;
}

export interface AfterHoursQuote {
  symbol: string;
  price: number;
}

export type StockQuote = Stock & Partial<Quote>;
