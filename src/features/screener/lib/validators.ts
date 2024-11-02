import { z } from 'zod';

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
  peRatioMin: z.coerce.number().optional(),
  peRatioMax: z.coerce.number().optional(),
  pegRatioMin: z.coerce.number().optional(),
  pegRatioMax: z.coerce.number().optional(),
  grossMarginMin: z.coerce.number().optional(),
  grossMarginMax: z.coerce.number().optional(),
  netMarginMin: z.coerce.number().optional(),
  netMarginMax: z.coerce.number().optional(),
  sma50Min: z.coerce.number().optional(),
  sma50Max: z.coerce.number().optional(),
});

export type ScreenerProps = z.infer<typeof ScreenerSchema>;
