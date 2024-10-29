import { z } from 'zod';

export const SearchSchema = z.object({
  input: z.string(),
});

export const ScreenerSchema = z.object({
  cursor: z.coerce.number().min(1).default(1).optional(),
  take: z.coerce.number().min(1).max(50).default(10).optional(),
  exchange: z.string().optional(),
  ticker: z.string().optional(),
  sector: z.string().optional(),
  industry: z.string().optional(),
  country: z.string().optional(),
  earningsDate: z.string().optional(),
  mktCap: z.string().optional(),
  peRatioMin: z.string().optional(),
  peRatioMax: z.string().optional(),
  pegRatioMin: z.string().optional(),
  pegRatioMax: z.string().optional(),
  sma50Min: z.string().optional(),
  sma50Max: z.string().optional(),
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
export type ScreenerProps = z.infer<typeof ScreenerSchema>;
export type HistoryProps = z.infer<typeof HistorySchema>;
export type UpdateStocksProps = z.infer<typeof UpdateStocksSchema>;
export type TheDayTraderProps = z.infer<typeof TheDayTraderSchema>;
