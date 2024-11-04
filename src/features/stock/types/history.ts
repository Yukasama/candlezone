import { History } from '@/lib/fmp/types/history';

export interface ChartData {
  domain: [number, number];
  startPrice: number;
  positive: boolean;
  results: Pick<History, 'date' | 'close'>[];
}
