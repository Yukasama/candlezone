import { CardDescription, CardTitle } from '@/components/ui/card';
import { AddModal } from '@/features/portfolio/add-modal';
import { Allocation } from '@/features/portfolio/chart/allocation';
import { PortfolioChart } from '@/features/portfolio/chart/portfolio-chart';
import { PositionManager } from '@/features/portfolio/position-manager';
import { getUser } from '@/lib/auth';
import { getPortfolioWithPositions } from '@/utils/queries/portfolio';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default async function PortfolioPage({
  params: { id },
}: Readonly<Props>) {
  const [user, portfolio] = await Promise.all([
    getUser(),
    getPortfolioWithPositions({ portfolioId: id }),
  ]);

  if (!portfolio) {
    return notFound();
  }

  const emptyPortfolio = portfolio.orders.length === 0;
  const isOwner = portfolio.userId === user?.id;

  return (
    <div className="f-col xl:flex-row">
      <div className="flex-1 flex-col border-r">
        {emptyPortfolio && (
          <div className="bg-faded f-center mx-4 mt-4 justify-between rounded-md border border-violet-500/80 p-3 px-5">
            <div>
              <CardTitle>No stocks in this portfolio.</CardTitle>
              <CardDescription>
                Get started by adding some stocks.
              </CardDescription>
            </div>
            <AddModal portfolio={portfolio} />
          </div>
        )}
        <PortfolioChart portfolio={portfolio} className="border-b" />
        <div className="flex justify-between p-4">
          <Allocation
            sectors={portfolio.orders.map((order) => order.stock.sector)}
          />
        </div>
      </div>
      <div className="hidden overflow-hidden lg:flex">
        <PositionManager portfolio={portfolio} isOwner={isOwner} />
      </div>
    </div>
  );
}
