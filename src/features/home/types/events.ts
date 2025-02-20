import { CurrentEarningsItem } from '@/features/earnings/types/earnings';
import { EconomicCalendarItem } from '@/lib/fmp/types/info';

export interface StockEvent {
  datetime: Date;
  events: (
    | (CurrentEarningsItem & { type: 'earnings' })
    | (EconomicCalendarItem & { type: 'economic' })
  )[];
  type: 'earnings' | 'economic';
}
