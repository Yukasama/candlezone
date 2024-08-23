import { OrderProps } from '@/lib/validators/portfolio'
import { PortfolioWithOrders } from '@/types/portfolio'

export const validateOrder = (
  portfolio: PortfolioWithOrders,
  order: Pick<OrderProps, 'stockId' | 'type' | 'quantity'>,
) => {
  const ordersByStockId = portfolio.orders.filter(
    (stockOrder) => stockOrder.stockId === order.stockId,
  )

  if (order.type === 'SELL') {
    let totalQuantity = 0

    for (const stockOrder of ordersByStockId) {
      if (stockOrder.type === 'BUY') {
        totalQuantity += stockOrder.quantity
      } else {
        totalQuantity -= stockOrder.quantity
      }
    }

    if (totalQuantity < order.quantity) {
      throw new Error('Not enough quantity to sell.')
    }
  }
}
