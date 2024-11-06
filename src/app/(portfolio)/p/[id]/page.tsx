import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AddModal } from '@/features/order/add-modal';
import { Allocation } from '@/features/portfolio/chart/allocation';
import { PortfolioChart } from '@/features/portfolio/chart/portfolio-chart';
import { getFullPortfolios } from '@/features/portfolio/lib/queries';
import { PositionManager } from '@/features/portfolio/position-manager';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { getUser } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PortfolioPage({ params }: Readonly<Props>) {
  const { id } = await params;

  const [user, portfolio] = await Promise.all([
    getUser(),
    getFullPortfolios({ portfolioId: id }),
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
          <div className="f-center mx-3 mt-4 justify-between rounded-full border border-violet-500/80 bg-accent p-3 px-6">
            <div>
              <CardTitle>No stocks yet in this portfolio.</CardTitle>
              <CardDescription>
                Get started by adding some stocks using the + icon.
              </CardDescription>
            </div>
            <AddModal portfolio={portfolio} />
          </div>
        )}
          <PortfolioChart portfolio={portfolio} className="border-b" />
        <div className="flex justify-between p-4">
          <Allocation
            sectors={portfolio.orders.map(({ stock }) => stock.sector)}
          />
          <Card className="bg-accent">
            <CardHeader>
              <CardTitle>Upcoming Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              {portfolio.orders.map(({ id, stock }) => (
                <div key={id} className="flex gap-2">
                  <SymbolItem stock={stock} size="sm" />
                  {stock.earningsDate}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="hidden overflow-hidden lg:flex">
        <PositionManager portfolio={portfolio} isOwner={isOwner} />
      </div>
    </div>
  );
}
