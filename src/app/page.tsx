import { siteConfig } from '@/config/site';
import { LandingTable } from '@/features/home/landing-table';
import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getStockQuotes } from '@/lib/fmp/quote/quote';
import { getPortfoliosWithStockIdsByUser } from '@/utils/queries/portfolio';

export const metadata = {
  title: `Stock Research & Analysis | ${siteConfig.name}`,
};

export default async function Homepage() {
  const user = await getUser();

  const [portfolios, stocks] = await Promise.all([
    getPortfoliosWithStockIdsByUser({ userId: user?.id }),
    db.stock.findMany({
      select: {
        id: true,
        symbol: true,
        companyName: true,
        image: true,
        sector: true,
        industry: true,
        country: true,
        exchange: true,
        mktCap: true,
      },
      where: {
        symbol: { not: { in: ['GOOGL', 'BRK-A'], contains: '.' } },
        isEtf: false,
        isFund: false,
        isActivelyTrading: true,
        exchange: { not: 'Other OTC' },
      },
      orderBy: { mktCap: 'desc' },
      take: 500,
    }),
  ]);

  const stockQuotes = await getStockQuotes(stocks);
  const stocksWithRank = stockQuotes.map((stock, i) => ({
    ...stock,
    rank: i + 1,
  }));

  return (
    <div className="f-col m-6 gap-10 md:mx-8 lg:mx-16 xl:mx-24">
      <LandingTable
        stocks={stocksWithRank}
        portfolios={portfolios}
        user={user}
      />
    </div>
  );
}
