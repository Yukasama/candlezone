import { siteConfig } from '@/config/site';
import { LandingTable } from '@/features/home/landing-table';
import { getUser } from '@/lib/auth';
import { getStockQuotes } from '@/lib/fmp/quote/quote';
import { getPortfoliosWithPositionsByUser } from '@/lib/queries/portfolio';
import { getPopularStocks } from '@/lib/queries/stock';

export const metadata = {
  title: `Stock Research & Analysis | ${siteConfig.name}`,
};

export default async function Homepage() {
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
    <div className="f-col m-3.5 gap-10 md:mx-8 lg:mx-16 xl:mx-24">
      <LandingTable
        stocks={stocksWithRank}
        portfolios={portfolios}
        user={user}
      />
    </div>
  );
}
