import { z } from 'zod';

const IndicatorSchema = z.object({
  name: z.string(),
});

export const TheDayTraderSchema = z.object({
  symbol: z.string(),
  timeframe: z.enum(['1D', '5D', '1M', '6M', '1Y', '5Y', 'All']),
  indicators: z.array(IndicatorSchema).nonempty(),
  options: z
    .object({
      allFields: z.boolean().optional(),
    })
    .optional(),
});

export type TheDayTraderProps = z.infer<typeof TheDayTraderSchema>;
