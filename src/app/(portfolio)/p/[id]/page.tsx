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
import { db } from '@/lib/db';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return await db.portfolio.findMany({ select: { id: true } });
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
            <Suspense>
              <AddModal portfolio={portfolio} />
            </Suspense>
          </div>
        )}
        <PortfolioChart portfolio={portfolio} className="border-b" />
        <div className="flex gap-4 p-4">
          <Allocation
            sectors={portfolio.orders.map(({ stock }) => stock.sector)}
          />
          <Card className="bg-faded border">
            <CardHeader>
              <CardTitle>Upcoming Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex justify-between">
                <p className="text-sm text-gray-500">NAME</p>
                <p className="text-sm text-gray-500">EARNINGS DATE</p>
              </div>
              <div className="space-y-1">
                {portfolio.orders.map(({ id, stock }) => (
                  <div key={id} className="flex gap-4">
                    <SymbolItem stock={stock} size="sm" fullLength />
                    <p className="text-sm">
                      {(stock.earningsDate instanceof Date &&
                        format(stock.earningsDate, 'MMMM do')) ??
                        'No earnings date found.'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="hidden overflow-hidden lg:flex">
        <Suspense>
          <PositionManager portfolio={portfolio} isOwner={isOwner} />
        </Suspense>
      </div>
    </div>
  );
}
