'use server'

import { getUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { getStockQuotes } from '@/lib/fmp/quote/quote'
import { logger } from '@/lib/logger'
import {
  AddOrdersProps,
  AddOrdersSchema,
  OrderProps,
} from '@/lib/validators/portfolio'
import { Portfolio, PortfolioOrder } from '@prisma/client'
import { revalidatePath } from 'next/cache'

/**
 * Add positions to a portfolio.
 * @param values `AddPortfolioPositionSchema` validator
 * @returns Success or error JSON object
 */
export const addOrders = async (values: AddOrdersProps) => {
  const validatedFields = AddOrdersSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug('addPortfolioPosition (invalid_data): values=%o', values)
    return { error: 'Invalid data.' }
  }

  const { portfolioId, orders } = validatedFields.data

  const user = await getUser()
  if (!user) {
    logger.debug(
      'addPortfolioPosition (unauthorized): portfolioId=%s orders=%o',
      portfolioId,
      orders
    )
    return { error: 'Unauthorized.' }
  }

  const [portfolio, stocksToAdd] = await Promise.all([
    db.portfolio.findFirst({
      select: {
        id: true,
        orders: {
          select: { stockId: true },
        },
      },
      where: {
        id: portfolioId,
        userId: user.id,
      },
    }),
    db.stock.findMany({
      select: {
        id: true,
        symbol: true,
        companyName: true,
      },
      where: {
        id: { in: orders.map((order) => order.stockId) },
      },
    }),
  ])

  const quotes = await getStockQuotes(stocksToAdd)

  if (!portfolio) {
    logger.debug(
      'addPortfolioPosition (not-found): portfolioId=%s',
      portfolioId,
    )
    return { error: 'Portfolio not found.' }
  }

  if (orders.length > 0) {
    insertOrder(
      portfolio, 
      order: {
      ...orders[0],
      price: quotes.find((quote) => quote.id === orders[0].stockId),
    })
  }

  revalidatePath(`/p/${portfolioId}`)

  logger.debug(
    'addPortfolioPosition (done): portfolioId=%s, positions=%o',
    portfolioId,
  )

  return { success: 'Positions added successfully.' }
}

interface PortfolioWithOrders extends Portfolio {
  orders: PortfolioOrder[]
}

const insertOrder = (portfolio: PortfolioWithOrders, order: OrderProps) => {
  const stockOrders = portfolio.orders.filter(
    (stockOrder) => stockOrder.stockId === order.stockId,
  )

  const newestOrderDate = stockOrders.reduce((newest, current) => {
    return new Date(current.date) > new Date(newest.date) ? current : newest
  }, stockOrders[0])

  if (
    newestOrderDate &&
    new Date(order.date) <= new Date(newestOrderDate.date)
  ) {
    throw new Error(
      'Cannot add order with an older or same date as the latest order for this stock.',
    )
  }

  if (order.type === 'SELL') {
    const totalQuantity = stockOrders.reduce((total, stockOrder) => {
      return stockOrder.type === 'BUY'
        ? total + stockOrder.quantity
        : total - stockOrder.quantity
    }, 0)

    if (totalQuantity < order.quantity) {
      throw new Error('Not enough quantity to sell.')
    }
  }

  return db.portfolioOrder.create({
    data: {
      portfolioId: portfolio.id,
      ...order,
    },
  })
}

const findOrdersToPortfolio =async () => {

}
