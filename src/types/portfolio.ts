import { getPositionsByPortfolioId } from '@/utils/queries/portfolio'
import { Portfolio, StockInPortfolio } from '@prisma/client'

export interface PortfolioWithStocks extends Portfolio {
  stocks: Pick<StockInPortfolio, 'stockId'>[]
}

export type PortfolioWithPositions = Exclude<
  Awaited<ReturnType<typeof getPositionsByPortfolioId>>,
  undefined
>
