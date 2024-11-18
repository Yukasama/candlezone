import { PageLayout } from '@/components/page-layout';
import { getOrdersWithStockByPortfolioId } from '@/features/order/lib/queries';
import { OrderCard } from '@/features/order/order-card';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PortfolioOrderHistory({
  params,
}: Readonly<Props>) {
  const { id } = await params;
  const orders = await getOrdersWithStockByPortfolioId({ portfolioId: id });

  return (
    <PageLayout>
      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="f-box f-col mt-10">
            <h1 className="text-xl font-medium">
              You havent created any orders yet.
            </h1>
          </div>
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </PageLayout>
  );
}
