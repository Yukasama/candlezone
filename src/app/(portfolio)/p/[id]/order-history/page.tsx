import { SymbolItem } from '@/components/stock/symbol-item'
import { Card, CardContent } from '@/components/ui/card'
import { db } from '@/lib/db'

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
    <div>
      {orders.map((order) => (
        <Card className="gap-3 border" key={order.id}>
          <div className="bg-faded p-2 px-3">
            <SymbolItem stock={order.stock} />
            <p className="text-sm text-gray-400">
              {order.date.toISOString().split('T')[0]}
            </p>
          </div>
          <CardContent className="f-center gap-2">
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
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
