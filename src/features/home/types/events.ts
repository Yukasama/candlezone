import { getCurrentEarnings } from '@/features/earnings/lib/queries';
import { EconomicEvent } from '@/lib/fmp/types/info';

export type EarningsData = Awaited<
  ReturnType<typeof getCurrentEarnings>
>[number];

export interface EarningsEvent extends EarningsData {
  datetime: Date;
  timeStr: string;
  type: 'earnings';
}

export interface EconomicEventExtended extends EconomicEvent {
  datetime: Date;
  type: 'economic';
}

export type StockEvent = EarningsEvent | EconomicEventExtended;
