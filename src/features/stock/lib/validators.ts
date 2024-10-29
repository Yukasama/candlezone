import { z } from 'zod';

export const SearchSchema = z.object({
  input: z.string(),
});

export const HistorySchema = z.object({
  symbol: z.string(),
  timeframe: z.enum(['1D', '5D', '1M', '6M', '1Y', '5Y', 'All']),
  allFields: z.boolean().optional(),
});

export const UpdateStocksSchema = z.object({
  testRun: z.boolean().optional(),
});

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

export type SearchProps = z.infer<typeof SearchSchema>;
export type HistoryProps = z.infer<typeof HistorySchema>;
export type UpdateStocksProps = z.infer<typeof UpdateStocksSchema>;
export type TheDayTraderProps = z.infer<typeof TheDayTraderSchema>;
