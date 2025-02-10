import { TIME_FRAMES } from '@/lib/fmp/history/time-frame';
import { Timeframe } from '@/lib/fmp/types/history';
import { z } from 'zod';

const IndicatorSchema = z.object({
  name: z.string(),
});

export const TheDayTraderSchema = z.object({
  symbol: z.string(),
  timeframe: z.enum(TIME_FRAMES as [Timeframe, ...Timeframe[]]),
  indicators: z.array(IndicatorSchema).nonempty(),
  options: z
    .object({
      allFields: z.boolean().optional(),
    })
    .optional(),
});

export type TheDayTraderProps = z.infer<typeof TheDayTraderSchema>;
