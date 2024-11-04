// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/no-useless-undefined */
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-top-level-await */

import { z } from 'zod';

export const ScreenerSchema = z.object({
  cursor: z.coerce.number().min(1).default(1).catch(1),
  take: z.coerce.number().min(1).max(50).default(10).catch(10),
  exchange: z.string().optional().catch(undefined),
  symbol: z.string().optional().catch(undefined),
  sector: z.string().optional().catch(undefined),
  industry: z.string().optional().catch(undefined),
  country: z.string().optional().catch(undefined),
  earningsDate: z.string().optional().catch(undefined),
  mktCap: z.string().optional().catch(undefined),
  peRatioMin: z.coerce.number().optional().catch(undefined),
  peRatioMax: z.coerce.number().optional().catch(undefined),
  pegRatioMin: z.coerce.number().optional().catch(undefined),
  pegRatioMax: z.coerce.number().optional().catch(undefined),
  grossMarginMin: z.coerce.number().optional().catch(undefined),
  grossMarginMax: z.coerce.number().optional().catch(undefined),
  netMarginMin: z.coerce.number().optional().catch(undefined),
  netMarginMax: z.coerce.number().optional().catch(undefined),
  sma50Min: z.coerce.number().optional().catch(undefined),
  sma50Max: z.coerce.number().optional().catch(undefined),
});

export type ScreenerProps = z.infer<typeof ScreenerSchema>;
