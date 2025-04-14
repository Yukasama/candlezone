import { PageLayout } from '@/components/page-layout';
import { getUser } from '@/features/auth/actions/get-user';
import { getOrdersByPortfolio } from '@/features/order/lib/get-orders-by-portfolio';
import { OrderCard } from '@/features/order/order-card';
import { OrderWithStock } from '@/features/order/types/order';
import { db } from '@/lib/db';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PortfolioOrderHistory({
  params,
}: Readonly<Props>) {
  const { id } = await params;
  const [user, portfolio, orders] = await Promise.all([
    getUser(),
    db.portfolio.findUnique({
      select: { userId: true },
      where: { id },
    }),
    getOrdersByPortfolio({ portfolioId: id }),
  ]);

  const isOwner = user?.id === portfolio?.userId;

  return (
    <PageLayout>
      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center">
            <h1 className="text-xl font-medium">
              You haven&apos;t created any orders yet.
            </h1>
          </div>
        ) : (
          orders.map((order: OrderWithStock) => (
            <OrderCard isOwner={isOwner} key={order.id} order={order} />
          ))
        )}
      </div>
    </PageLayout>
  );
}
