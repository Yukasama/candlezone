import { Portfolio, PortfolioOrder, Stock } from '@prisma/client';
import { getPortfolioWithPositions } from '../lib/portfolio';

export interface PortfolioWithStockIds extends Portfolio {
  orders: Pick<PortfolioOrder, 'stockId'>[];
}

export interface OrderWithStock extends PortfolioOrder {
  stock: Pick<
    Stock,
    'id' | 'symbol' | 'companyName' | 'image' | 'sector' | 'peRatioTTM'
  >;
}

export interface PortfolioWithOrders extends Portfolio {
  orders: PortfolioOrder[];
}

export type PortfolioWithQuotes = Exclude<
  Awaited<ReturnType<typeof getPortfolioWithPositions>>,
  undefined
>;
