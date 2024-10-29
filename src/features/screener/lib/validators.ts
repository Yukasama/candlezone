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
  peRatioMin: z.string().optional(),
  peRatioMax: z.string().optional(),
  pegRatioMin: z.string().optional(),
  pegRatioMax: z.string().optional(),
  sma50Min: z.string().optional(),
  sma50Max: z.string().optional(),
});

export type ScreenerProps = z.infer<typeof ScreenerSchema>;
