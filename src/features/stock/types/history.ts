import { History } from '@/lib/fmp/types/history';
import { getHistory } from '../actions/get-history';

export interface ChartData {
  domain: [number, number];
  positive: boolean;
  results: Pick<History, 'close' | 'date'>[];
  startPrice: number;
}

export type StockHistory = Awaited<ReturnType<typeof getHistory>>;
