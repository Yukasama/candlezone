import { History } from '@/lib/fmp/types/history';
import { getHistory } from '../actions/get-history';

export interface ChartData {
  domain: [number, number];
  startPrice: number;
  positive: boolean;
  results: Pick<History, 'date' | 'close'>[];
}

export type StockHistory = Awaited<ReturnType<typeof getHistory>>;
