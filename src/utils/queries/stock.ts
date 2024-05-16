import { db } from '@/lib/db'

export const getRecentStocksByUserId = async (
  userId?: string,
  take: number = 5
) => {
  return await db.userRecentStocks.findMany({
    select: {
      stock: {
        select: {
          id: true,
          symbol: true,
          image: true,
          companyName: true,
          sector: true,
          industry: true,
          peRatioTTM: true,
        },
      },
    },
    where: { userId },
    orderBy: { createdAt: 'desc' },
    distinct: 'stockId',
    take,
  })
}

export const addToRecentStocks = async ({
  userId,
  stockId,
}: {
  userId: string
  stockId: string
}) => {
  const oneMinuteAgo = new Date(new Date().getTime() - 60000)
  const recentEntry = await db.userRecentStocks.count({
    where: {
      userId,
      stockId,
      createdAt: { gte: oneMinuteAgo },
    },
  })

  if (!recentEntry) {
    await db.userRecentStocks.create({
      data: {
        userId,
        stockId,
      },
    })
  }
}
