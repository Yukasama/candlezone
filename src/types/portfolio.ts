import {
  getPortfoliosWithStocksByUser,
  getPortfolioWithQuotes,
} from '@/utils/queries/portfolio'
import { Portfolio, PortfolioOrder } from '@prisma/client'

export interface PortfolioWithStockIds extends Portfolio {
  orders: Pick<PortfolioOrder, 'stockId'>[]
}

export interface PortfolioWithOrders extends Portfolio {
  orders: PortfolioOrder[]
}

export type PortfolioWithStocks = Exclude<
  Awaited<ReturnType<typeof getPortfoliosWithStocksByUser>>,
  undefined
>[0]

export type PortfolioWithQuotes = Exclude<
  Awaited<ReturnType<typeof getPortfolioWithQuotes>>,
  undefined
>
