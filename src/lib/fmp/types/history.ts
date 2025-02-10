export interface DailyHistory {
  historical: History[];
  symbol: string;
}

export type DualHistory = History[] | { historical: History[] };

export interface History {
  change?: number;
  changePercent?: number;
  close: number;
  date: string;
  high?: number;
  label?: string;
  low?: number;
  open?: number;
  volume: number;
  vwap?: number;
}

export interface MultipleDailyHistory {
  historicalStockList: DailyHistory[];
}

export type Timeframe = '1D' | '1M' | '1Y' | '5D' | '5Y' | '6M' | 'All';
