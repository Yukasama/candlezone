import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getPortfolioHistory } from '../actions/get-portfolio-history';
import { PortfolioHistory } from '../types/history';
import { PortfolioWithQuotes } from '../types/portfolio';

const computePortfolioDomain = (data: PortfolioHistory[]): [number, number] => {
  const values = data.map((item) => item.return);
  const dataMax = Math.max(...values);
  const dataMin = Math.min(...values);
  const padding = (dataMax - dataMin) * 0.15;
  const lowerEnd = Math.min(0, dataMin + padding);

  return [lowerEnd, dataMax + padding];
};

interface Props {
  portfolio: PortfolioWithQuotes;
  options: { excludeQuantity: boolean; showRealizedPL: boolean };
}

export const usePortfolioHistory = ({
  portfolio,
  options,
}: Readonly<Props>) => {
  const emptyPortfolio = portfolio.orders.length === 0;

  const { data, refetch, isLoading, isError } = useQuery({
    queryFn: async () => {
      return await getPortfolioHistory({ portfolioId: portfolio.id, options });
    },
    queryKey: ['portfolio-history', portfolio.id, options],
    staleTime: 1000 * 60,
    enabled: !emptyPortfolio,
  });

  const chartData = useMemo(() => {
    if (!isError && data) {
      const domain = computePortfolioDomain(data);
      const startPrice = Number(data[0].return);
      const endPrice = Number(data.at(-1)?.return);
      const positive = endPrice >= startPrice;
      const today = endPrice - (data.at(-2)?.return ?? 0);

      return { domain, startPrice, endPrice, today, positive, results: data };
    }
  }, [isError, data]);

  return { chartData, refetch, isLoading, isError };
};
