import { SymbolItem } from '@/components/stock/symbol-item'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { OrderActions } from '@/features/portfolio/order-actions'
import { cn } from '@/lib/utils'
import { getOrdersWithStockByPortfolioId } from '@/utils/queries/order'

interface Props {
  params: { id: string }
}

export default async function PortfolioOrderHistory({
  params: { id },
}: Readonly<Props>) {
  const orders = await getOrdersWithStockByPortfolioId({ portfolioId: id })

  return (
    <div className="f-col gap-3 overflow-auto p-6 lg:p-16 lg:px-40">
      {!orders.length && (
        <div className="f-box f-col mt-10">
          <h1 className="text-xl font-medium">
            You havent created any orders yet.
          </h1>
        </div>
      )}

      {orders.map((order) => (
        <Card
          className={cn(
            'gap-3 border',
            order.deleted && 'pointer-events-none opacity-50',
          )}
          key={order.id}
        >
          <div className="bg-faded relative flex justify-between p-2 px-3">
            <div className="flex items-start gap-2">
              <SymbolItem stock={order.stock} />
              <Badge
                className={cn(
                  'mt-0.5 bg-red-500/80 text-white',
                  order.type === 'BUY' ? 'bg-emerald-500' : 'bg-price-down',
                )}
              >
                {order.type}
              </Badge>
            </div>
            {order.deleted ? (
              <Badge className="absolute right-2 top-2 bg-red-500/80 text-white">
                Deleted
              </Badge>
            ) : (
              <OrderActions order={order} />
            )}
          </div>
          <div className="f-center gap-5 p-3 px-4">
            <div className="text-sm">
              <p className="text-gray-400">Execution Date</p>
              <p>{order.date.toISOString().split('T')[0]}</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-400">Order Type</p>
              <p>{order.type}</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-400">Quantity</p>
              <p>{order.quantity}</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-400">Price</p>
              <p>{order.price}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
