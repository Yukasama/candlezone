import {
  getPortfoliosWithStocksByUser,
  getPortfolioWithQuotes,
} from '@/utils/queries/portfolio'
import { Portfolio, StockInPortfolio } from '@prisma/client'

export interface PortfolioWithStockIds extends Portfolio {
  stocks: Pick<StockInPortfolio, 'stockId'>[]
}

export type PortfolioWithStocks = Exclude<
  Awaited<ReturnType<typeof getPortfoliosWithStocksByUser>>,
  undefined
>[0]

export type PortfolioWithQuotes = Exclude<
  Awaited<ReturnType<typeof getPortfolioWithQuotes>>,
  undefined
>
