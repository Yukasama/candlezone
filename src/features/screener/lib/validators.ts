/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable unicorn/prefer-top-level-await */
/* eslint-disable unicorn/no-useless-undefined */

import { z } from 'zod';

export const ScreenerSchema = z.object({
  country: z.string().optional().catch(undefined),
  cursor: z.coerce.number().min(1).default(1).catch(1),
  earningsDate: z.string().optional().catch(undefined),
  exchange: z.string().optional().catch(undefined),
  grossMarginMax: z.coerce.number().optional().catch(undefined),
  grossMarginMin: z.coerce.number().optional().catch(undefined),
  industry: z.string().optional().catch(undefined),
  marketCap: z.string().optional().catch(undefined),
  netMarginMax: z.coerce.number().optional().catch(undefined),
  netMarginMin: z.coerce.number().optional().catch(undefined),
  pegRatioMax: z.coerce.number().optional().catch(undefined),
  pegRatioMin: z.coerce.number().optional().catch(undefined),
  peRatioMax: z.coerce.number().optional().catch(undefined),
  peRatioMin: z.coerce.number().optional().catch(undefined),
  sector: z.string().optional().catch(undefined),
  sma50Max: z.coerce.number().optional().catch(undefined),
  sma50Min: z.coerce.number().optional().catch(undefined),
  symbol: z.string().optional().catch(undefined),
  take: z.coerce.number().min(1).max(50).default(10).catch(10),
});

export type ScreenerProps = z.infer<typeof ScreenerSchema>;

/* eslint-enable unicorn/prefer-top-level-await */
/* eslint-enable unicorn/no-useless-undefined */
