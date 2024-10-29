import { Loader } from '@/components/loader';
import { siteConfig } from '@/config/site';
import { LandingTable } from '@/features/home/landing-table';
import { getPortfoliosWithPositionsByUser } from '@/features/portfolio/lib/queries';
import { getPopularStocks } from '@/features/stock/lib/queries';
import { getUser } from '@/lib/auth';
import { getStockQuotes } from '@/lib/fmp/quote/quote';
import { Suspense } from 'react';

export const metadata = {
  title: `Stock Research & Analysis | ${siteConfig.name}`,
};

export default async function StockPage() {
  const user = await getUser();
  const [portfolios, stocks] = await Promise.all([
    user ? getPortfoliosWithPositionsByUser({ userId: user?.id }) : [],
    getPopularStocks(),
  ]);

  const stockQuotes = await getStockQuotes(stocks);
  const stocksWithRank = stockQuotes.map((stock, i) => ({
    ...stock,
    rank: i + 1,
  }));

  return (
    <div className="f-col m-3.5 gap-10 md:mx-8 lg:m-5 lg:mx-16 xl:mx-24">
      <Suspense fallback={<Loader />}>
        <LandingTable
          stocks={stocksWithRank}
          portfolios={portfolios}
          user={user}
        />
      </Suspense>
    </div>
  );
}
