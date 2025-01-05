import { getOrdersWithStockByPortfolioId } from '../lib/queries';

export type OrderWithStock = Awaited<
  ReturnType<typeof getOrdersWithStockByPortfolioId>
>[number];
