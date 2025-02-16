import { Earnings } from './types/info';

interface CreateEarningsParams {
  earning: Earnings;
  stockId: number;
}

export const createEarnings = ({ earning, stockId }: CreateEarningsParams) => {
  return {
    date: new Date(String(earning.date)),
    epsActual: earning.eps ? Number(earning.eps) : undefined,
    epsEstimated: Number(earning.epsEstimated),
    fiscalDateEnding: earning.fiscalDateEnding
      ? new Date(String(earning.fiscalDateEnding))
      : undefined,
    revenueActual: earning.revenue ? Number(earning.revenue) : undefined,
    revenueEstimated: Number(earning.revenueEstimated),
    stockId,
    updatedFromDate: earning.updatedFromDate
      ? new Date(String(earning.updatedFromDate))
      : undefined,
  };
};
