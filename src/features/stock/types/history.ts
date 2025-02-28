import { History } from '@/lib/fmp/types/history';

export interface ChartData {
  domain: [number, number];
  positive: boolean;
  results: Pick<History, 'close' | 'date'>[];
  startPrice: number;
}
