import type { Portfolio, PortfolioOrder } from '@prisma/client';
import { getFullPortfolios } from '../lib/queries';

export interface PortfolioWithOrders extends Portfolio {
  orders: PortfolioOrder[];
}

export type PortfolioWithQuotes = Exclude<
  Awaited<ReturnType<typeof getFullPortfolios>>,
  undefined
>;
