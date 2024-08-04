import { db } from '@/lib/db'
import { getStockQuotes } from '@/lib/fmp/quote/quote'

export const getPortfoliosByUser = async ({ userId }: { userId?: string }) => {
  return await db.portfolio.findMany({
    include: {
      stocks: {
        select: { stockId: true },
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
      stocks: {
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
      ...portfolio.stocks.find((s) => s.stockId === stock.id)!,
      ...stock,
      stock: undefined,
    })),
  }
}
