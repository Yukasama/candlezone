import {
  getPortfoliosWithStocksByUser,
  getPortfolioWithPositions,
} from '@/lib/queries/portfolio';
import { Portfolio, PortfolioOrder, Stock } from '@prisma/client';

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

export type PortfolioWithStocks = Exclude<
  Awaited<ReturnType<typeof getPortfoliosWithStocksByUser>>,
  undefined
>[0];

export type PortfolioWithQuotes = Exclude<
  Awaited<ReturnType<typeof getPortfolioWithPositions>>,
  undefined
>;

export interface PortfolioHistory {
  date: string;
  return: number;
  realizedPL?: number;
}

export interface PortfolioChartData {
  domain: [number, number];
  startPrice: number;
  endPrice: number;
  today: number;
  positive: boolean;
  results: PortfolioHistory[];
}
