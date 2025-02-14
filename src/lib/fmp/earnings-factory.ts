import { Earnings as EarningsType } from './types/info';

interface CreateEarningsParams {
  earning: EarningsType;
  stockId: number;
}

const normalizeEarningsData = (params: CreateEarningsParams) => {
  const { earning, stockId } = params;

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

export const createEarnings = (params: CreateEarningsParams) => {
  return normalizeEarningsData(params);
};
