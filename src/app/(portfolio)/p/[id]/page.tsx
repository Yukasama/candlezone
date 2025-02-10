import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getUser } from '@/features/auth/actions/get-user';
import { AddOrderModal } from '@/features/order/add-order-modal';
import { Allocation } from '@/features/portfolio/chart/allocation';
import { PortfolioChart } from '@/features/portfolio/chart/portfolio-chart';
import { getFullPortfolio } from '@/features/portfolio/lib/queries';
import { PositionManager } from '@/features/portfolio/position-manager';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PortfolioPage({ params }: Readonly<Props>) {
  const { id } = await params;

  const [user, portfolio] = await Promise.all([
    getUser(),
    getFullPortfolio({ portfolioId: id }),
  ]);

  if (!portfolio) {
    return notFound();
  }

  const emptyPortfolio = portfolio.orders.length === 0;
  const isOwner = portfolio.userId === user?.id;

  return (
    <div className="flex flex-col xl:flex-row">
      <div className="flex-1 flex-col border-r">
        {emptyPortfolio && isOwner && (
          <div className="bg-accent border-mythic mx-3 mt-4 flex items-center justify-between rounded-full border p-3 px-6">
            <div>
              <CardTitle>No stocks yet in this portfolio.</CardTitle>
              <CardDescription>
                Get started by adding some stocks using the + icon.
              </CardDescription>
            </div>
            <Suspense>
              <AddOrderModal portfolio={portfolio} />
            </Suspense>
          </div>
        )}
        <PortfolioChart portfolio={portfolio} />
        <div className="flex flex-col gap-4 p-4 xl:flex-row">
          <Allocation
            sectors={portfolio.orders.map(({ stock }) => stock.sector)}
          />
          <Card className="border">
            <CardHeader>
              <CardTitle>Upcoming Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex justify-between">
                <p className="text-desc text-sm">NAME</p>
                <p className="text-desc text-sm">EARNINGS DATE</p>
              </div>
              <div className="space-y-1">
                {portfolio.orders.map(({ stock, stockId }) => (
                  <div
                    className="flex gap-4"
                    key={String(stockId) + 'earnings'}
                  >
                    <SymbolItem fullLength size="sm" stock={stock} />
                    <p className="text-sm">
                      {stock.earningsDate instanceof Date
                        ? format(stock.earningsDate, 'MMMM do')
                        : 'No earnings date found.'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="overflow-hidden">
        <Suspense>
          <PositionManager isOwner={isOwner} portfolio={portfolio} />
        </Suspense>
      </div>
    </div>
  );
}
