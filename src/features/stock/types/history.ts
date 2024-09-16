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

export interface ChartData {
  domain: [number, number];
  startPrice: number;
  positive: boolean;
  results: Pick<History, 'date' | 'close'>[];
}
