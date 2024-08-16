import { db } from '@/lib/db'
import { getStockQuotes } from '@/lib/fmp/quote/quote'

export const getPortfoliosByUser = async ({ userId }: { userId?: string }) => {
  return await db.portfolio.findMany({
    include: {
      orders: {
        select: { stockId: true },
        distinct: ['stockId'],
      },
    },
    where: { userId },
    orderBy: { createdAt: 'asc' },
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
      },
    },
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export const getPortfolioWithQuotes = async ({
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
        distinct: ['stockId'],
      },
    },
    where: { id: portfolioId },
  })

  if (!portfolio) {
    return
  }

  const stockQuotes = await getStockQuotes(
    portfolio.orders.map((order) => order.stock),
  )

  return {
    ...portfolio,
    orders: stockQuotes.map((stock) => ({
      ...portfolio.orders.find((order) => order.stockId === stock.id)!,
      ...stock,
      stock: undefined,
    })),
  }
}
