import { SymbolItem } from '@/components/stock/symbol-item'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { db } from '@/lib/db'
import { cn } from '@/lib/utils'

interface Props {
  params: { id: string }
}

export default async function PortfolioOrderHistory({
  params: { id },
}: Readonly<Props>) {
  const orders = await db.portfolioOrder.findMany({
    include: {
      stock: {
        select: {
          symbol: true,
          companyName: true,
          image: true,
        },
      },
    },
    where: {
      portfolioId: id,
    },
    orderBy: {
      date: 'desc',
    },
  })

  return (
    <div className="f-col gap-3 p-4 px-3 sm:px-10">
      {!orders.length && (
        <div className="f-box f-col mt-10">
          <h1 className="text-xl font-medium">
            You havent created any orders yet.
          </h1>
        </div>
      )}
      {orders.map((order) => (
        <Card className="gap-3 border" key={order.id}>
          <div className="bg-faded flex items-start gap-2 p-2 px-3">
            <SymbolItem stock={order.stock} />
            <Badge
              className={cn(
                'mt-[1px] bg-red-500/80 text-white',
                order.type === 'BUY' ? 'bg-emerald-500' : 'bg-price-down',
              )}
            >
              {order.type}
            </Badge>
            {order.deleted && <Badge variant="secondary">Deleted</Badge>}
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
