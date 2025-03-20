import { CurrentEarnings } from '@/features/earnings/types/earnings';
import { EconomicCalendarItem } from '@/lib/fmp/types/info';

export interface EventsByDay {
  today: StockEvent[];
  tomorrow: StockEvent[];
  yesterday: StockEvent[];
}

export type EventWithType =
  | (CurrentEarnings[number] & { type: 'earnings' })
  | (EconomicCalendarItem & { type: 'economic' });

export interface StockEvent {
  datetime: Date;
  events: (
    | (CurrentEarnings[number] & { type: 'earnings' })
    | (EconomicCalendarItem & { type: 'economic' })
  )[];
  type: 'earnings' | 'economic';
}
