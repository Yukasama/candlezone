import { getOrdersByPortfolio } from '../lib/get-orders-by-portfolio';

export type OrderWithStock = Awaited<
  ReturnType<typeof getOrdersByPortfolio>
>[number];
