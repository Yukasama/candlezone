import { z } from 'zod'

export const SearchSchema = z.object({
  search: z.string(),
})

export const ScreenerSchema = z.object({
  cursor: z.number().min(1).default(1).optional(),
  take: z.number().min(1).max(50).default(10).optional(),
  exchange: z.string(),
  ticker: z.string().optional(),
  sector: z.string(),
  industry: z.string(),
  country: z.string(),
  earningsDate: z.string(),
  peRatio: z.tuple([z.string(), z.string()]),
  pegRatio: z.tuple([z.string(), z.string()]),
  mktCap: z.string(),
  sma50: z.tuple([z.string(), z.string()]),
})

export const HistorySchema = z.object({
  symbol: z.string(),
  timeframe: z.enum(['1D', '5D', '1M', '6M', '1Y', '5Y', 'All']),
  allFields: z.boolean().optional(),
})

export const UploadStocksSchema = z.object({
  testRun: z.boolean().optional(),
})

export type SearchProps = z.infer<typeof SearchSchema>
export type ScreenerProps = z.infer<typeof ScreenerSchema>
export type HistoryProps = z.infer<typeof HistorySchema>
export type UploadStocksProps = z.infer<typeof UploadStocksSchema>
