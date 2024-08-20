import { db } from '@/lib/db'
import { getStockQuotes } from '@/lib/fmp/quote/quote'
import { OrderWithStock } from '@/types/portfolio'

export const getPortfoliosByUser = async ({ userId }: { userId?: string }) => {
  return await db.portfolio.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  })
}

export const getPortfoliosWithStockIdsByUser = async ({
  userId,
}: {
  userId?: string
}) => {
  return await db.portfolio.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    include: {
      orders: {
        select: { stockId: true },
        distinct: ['stockId'],
      },
    },
  })
}

export const getPortfoliosWithStocksByUser = async ({
  userId,
}: {
  userId?: string
}) => {
  return await db.portfolio.findMany({
    include: {
      orders: {
        select: {
          stockId: true,
          stock: {
            select: {
              symbol: true,
              image: true,
              companyName: true,
            },
          },
        },
        distinct: ['stockId'],
        where: {
          deleted: false,
        },
      },
    },
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}
export const getPortfolioWithPositions = async ({
  portfolioId,
}: {
  portfolioId: string
}) => {
  const portfolio = await db.portfolio.findFirst({
    include: {
      orders: {
        include: {
          stock: {
            select: {
              id: true,
              symbol: true,
              companyName: true,
              image: true,
              peRatioTTM: true,
              sector: true,
            },
          },
        },
        where: {
          deleted: false,
        },
      },
    },
    where: { id: portfolioId },
  })

  if (!portfolio) {
    return
  }

  const stockMap = mergeOrders(portfolio.orders)
  const validOrders = Array.from(stockMap.values()).map((entry) => {
    const averagePrice = entry.totalValue / entry.quantity
    return {
      ...entry.order,
      quantity: entry.quantity,
      price: averagePrice,
    }
  })

  const stockQuotes = await getStockQuotes(
    validOrders.map((order) => order.stock),
  )

  const ordersWithQuotes = stockQuotes.map((stock) => {
    const order = validOrders.find((o) => o.stockId === stock.id)!
    return {
      ...order,
      stock,
    }
  })

  return {
    ...portfolio,
    orders: ordersWithQuotes,
  }
}

const mergeOrders = (orders: OrderWithStock[]) => {
  const stockMap = new Map<
    string,
    {
      quantity: number
      order: OrderWithStock
      totalValue: number
    }
  >()

  for (const order of orders) {
    const existing = stockMap.get(order.stockId)

    const newQuantity = existing
      ? existing.quantity +
        (order.type === 'BUY' ? order.quantity : -order.quantity)
      : order.type === 'BUY'
        ? order.quantity
        : -order.quantity

    const totalValue = existing
      ? existing.totalValue +
        order.price * (order.type === 'BUY' ? order.quantity : -order.quantity)
      : order.price * (order.type === 'BUY' ? order.quantity : -order.quantity)

    if (newQuantity > 0) {
      stockMap.set(order.stockId, { quantity: newQuantity, order, totalValue })
    } else {
      stockMap.delete(order.stockId)
    }
  }

  return stockMap
}
