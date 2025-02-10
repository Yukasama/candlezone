import { TIME_FRAMES } from '@/lib/fmp/history/time-frame';
import { Timeframe } from '@/lib/fmp/types/history';
import { z } from 'zod';

export const SearchSchema = z.object({
  input: z.string().min(1),
});

export const HistorySchema = z.object({
  symbol: z.string(),
  timeframe: z.enum(TIME_FRAMES as [Timeframe, ...Timeframe[]]),
  all: z.boolean().optional(),
});

export const UpdateStocksSchema = z.object({
  testRun: z.boolean().optional(),
});

export type SearchProps = z.infer<typeof SearchSchema>;
export type HistoryProps = z.infer<typeof HistorySchema>;
export type UpdateStocksProps = z.infer<typeof UpdateStocksSchema>;
