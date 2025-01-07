import type { Portfolio, PortfolioOrder } from '@prisma/client';
import { getFullPortfolio } from '../lib/queries';

export interface PortfolioWithOrders extends Portfolio {
  orders: PortfolioOrder[];
}

export type PortfolioWithQuotes = Exclude<
  Awaited<ReturnType<typeof getFullPortfolio>>,
  undefined
>;
