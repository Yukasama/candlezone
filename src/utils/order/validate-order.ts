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
    const totalQuantity = ordersByStockId.reduce((total, stockOrder) => {
      return stockOrder.type === 'BUY'
        ? total + stockOrder.quantity
        : total - stockOrder.quantity
    }, 0)

    if (totalQuantity < order.quantity) {
      throw new Error('Not enough quantity to sell.')
    }
  }
}
