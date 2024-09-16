import { PageLayout } from '@/components/page-layout';
import { getOrdersWithStockByPortfolioId } from '@/features/order/lib/order';
import { OrderCard } from '@/features/order/order-card';

interface Props {
  params: { id: string };
}

export default async function PortfolioOrderHistory({
  params: { id },
}: Readonly<Props>) {
  const orders = await getOrdersWithStockByPortfolioId({ portfolioId: id });

  return (
    <PageLayout>
      <div className="f-col gap-3">
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
