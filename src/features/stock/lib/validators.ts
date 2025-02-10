import { TIME_FRAMES } from '@/lib/fmp/history/time-frame';
import { Timeframe } from '@/lib/fmp/types/history';
import { z } from 'zod';

export const SearchSchema = z.object({
  input: z.string().min(1),
});

export const HistorySchema = z.object({
  all: z.boolean().optional(),
  symbol: z.string(),
  timeframe: z.enum(TIME_FRAMES as [Timeframe, ...Timeframe[]]),
});

export const UpdateStocksSchema = z.object({
  testRun: z.boolean().optional(),
});

export type HistoryProps = z.infer<typeof HistorySchema>;
export type SearchProps = z.infer<typeof SearchSchema>;
export type UpdateStocksProps = z.infer<typeof UpdateStocksSchema>;
