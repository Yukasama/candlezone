import { getPortfolioHistory } from '@/actions/portfolio/get-portfolio-history';
import { PortfolioWithOrders } from '@/types/portfolio';
import { computePortfolioDomain } from '@/utils/chart-helper';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface Props {
  portfolio: PortfolioWithOrders;
  options: { excludeQuantity: boolean; showRealizedPL: boolean };
}

export const usePortfolioHistory = ({
  portfolio,
  options,
}: Readonly<Props>) => {
  const { data, refetch, isFetched } = useQuery({
    queryFn: async () => {
      return await getPortfolioHistory({
        portfolioId: portfolio.id,
        options,
      });
    },
    queryKey: ['portfolio-history', portfolio.id, options.excludeQuantity],
    staleTime: 1000 * 60,
  });

  const chartData = useMemo(() => {
    if (isFetched && data?.length) {
      const domain = computePortfolioDomain(data);
      const startPrice = Number(data[0].return);
      const endPrice = Number(data.at(-1)?.return);
      const positive = endPrice >= startPrice;
      const today = endPrice - (data.at(-2)?.return ?? 0);

      return {
        domain,
        startPrice,
        endPrice,
        today,
        positive,
        results: data,
      };
    }
  }, [isFetched, data]);

  return { chartData, refetch, isFetched };
};
