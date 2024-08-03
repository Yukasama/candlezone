import { db } from '@/lib/db'
import { getStockQuotes } from '@/lib/fmp/quote/quote'

export const getPortfoliosByUserId = async ({
  userId,
}: {
  userId?: string
}) => {
  return await db.portfolio.findMany({
    select: {
      id: true,
      title: true,
      color: true,
      createdAt: true,
      isPublic: true,
      stocks: {
        select: { stockId: true },
      },
    },
    where: { userId },
    orderBy: { createdAt: 'asc' },
  })
}

export const getPositionsByPortfolioId = async ({
  portfolioId,
}: {
  portfolioId: string
}) => {
  const portfolio = await db.portfolio.findFirst({
    include: {
      stocks: {
        select: {
          stockId: true,
          quantity: true,
          createdAt: true,
          price: true,
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
      },
    },
    where: { id: portfolioId },
  })

  if (!portfolio) {
    return
  }

  const stockQuotes = await getStockQuotes(
    portfolio.stocks.map((stock) => stock.stock),
  )

  return {
    ...portfolio,
    stocks: stockQuotes.map((stock) => ({
      ...portfolio.stocks.find((s) => s.stockId === stock.id),
      ...stock,
    })),
  }
}
