import type { Portfolio, PortfolioOrder, Stock } from '@prisma/client';
import { getFullPortfolios } from '../lib/queries';

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
  Awaited<ReturnType<typeof getFullPortfolios>>,
  undefined
>;
