import {
  getPortfoliosWithStocksByUser,
  getPortfolioWithPositions,
} from '@/utils/queries/portfolio'
import { Portfolio, PortfolioOrder, Stock } from '@prisma/client'

export interface PortfolioWithStockIds extends Portfolio {
  orders: Pick<PortfolioOrder, 'stockId'>[]
}

export interface OrderWithStock extends PortfolioOrder {
  stock: Pick<
    Stock,
    'id' | 'symbol' | 'companyName' | 'image' | 'sector' | 'peRatioTTM'
  >
}

export interface PortfolioWithOrders extends Portfolio {
  orders: PortfolioOrder[]
}

export type PortfolioWithStocks = Exclude<
  Awaited<ReturnType<typeof getPortfoliosWithStocksByUser>>,
  undefined
>[0]

export type PortfolioWithQuotes = Exclude<
  Awaited<ReturnType<typeof getPortfolioWithPositions>>,
  undefined
>
