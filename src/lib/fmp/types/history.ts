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

export type DualHistory = History[] | { historical: History[] };

export type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | '5Y' | 'All';
