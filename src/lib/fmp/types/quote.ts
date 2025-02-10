export interface AfterHoursQuote {
  asize?: number;
  ask: number;
  bid: number;
  bsize?: number;
  symbol: string;
  timestamp?: number;
}

export interface Quote {
  avgVolume?: number;
  change?: number;
  changesPercentage?: number;
  dayHigh?: number;
  dayLow?: number;
  earningsAnnouncement?: string;
  eps?: number;
  exchange?: string;
  marketCap?: number;
  name: string;
  open?: number;
  pe?: number;
  price: number;
  priceAvg50?: number;
  priceAvg200?: number;
  sharesOutstanding?: number;
  symbol: string;
  timestamp?: number;
  volume?: number;
  yearHigh?: number;
  yearLow?: number;
}
