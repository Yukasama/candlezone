import { buttonVariants } from '@/components/ui/button';
import { getUser } from '@/lib/auth';
import { getStockQuotes } from '@/lib/fmp/quote/quote';
import { getPortfoliosWithStocksByUser } from '@/utils/queries/portfolio';
import { getRecentStocksByUserId } from '@/utils/queries/stock';
import { ExternalLink, Plus } from 'lucide-react';
import Link from 'next/link';
import { DashboardPortfolioCard } from './dashboard-portfolio-card';
import { DashboardStockCard } from './dashboard-stock-card';

export const DashboardSidebar = async () => {
  const user = await getUser();
  const [stocks, portfolios] = await Promise.all([
    getRecentStocksByUserId(user?.id, 5),
    getPortfoliosWithStocksByUser({ userId: user?.id }),
  ]);

  const stockQuotes = await getStockQuotes(stocks.map((stock) => stock.stock));

  return (
    <div className="lg:f-col hidden gap-8 border-r bg-gray-200/40 p-8 dark:bg-gray-800/30">
      <div className="f-col gap-4">
        <div className="flex justify-between">
          <h3 className="text-xl font-medium">My Portfolios</h3>
          <Link
            href={portfolios.length === 0 ? '/p/new' : `/p/${portfolios[0].id}`}
            className={buttonVariants({ size: 'icon-sm' })}
          >
            <Plus size={16} />
            <p className="text-[13px]">Create new</p>
          </Link>
        </div>
        <div className="f-col gap-2.5">
          {portfolios?.map((portfolio) => (
            <DashboardPortfolioCard key={portfolio.id} portfolio={portfolio} />
          )) ?? <p className="text-gray-400">No portfolios created yet.</p>}
        </div>
      </div>

      <div className="f-col gap-4">
        <div className="flex justify-between">
          <h3 className="text-xl font-medium">Recent Activity</h3>
          <Link href="/" className={buttonVariants({ size: 'icon-sm' })}>
            <ExternalLink size={16} />
            <p className="text-[13px]">View stocks</p>
          </Link>
        </div>
        <div className="f-col gap-2">
          {stockQuotes?.map((stock) => (
            <DashboardStockCard
              key={stock.symbol}
              stock={stock}
              portfolios={portfolios}
              user={user}
            />
          )) ?? <p className="text-gray-400">No recent activity.</p>}
        </div>
      </div>
    </div>
  );
};
