import { db } from '@/lib/db'

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
