'use server'

import { getUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { notFound } from 'next/navigation'

/**
 * Fetches the latest stock inserts to the database
 * @returns Latest 3 stock inserts
 */
export async function getLatestInserts() {
  const user = await getUser()

  if (!user) {
    logger.debug('getLatestInserts (unauthorized)')
    return notFound()
  }

  if (user?.role !== 'ADMIN') {
    logger.debug('getLatestInserts (forbidden): userId=%s', user.id)
    return notFound()
  }

  return await db.stock.findMany({
    select: {
      symbol: true,
      companyName: true,
      image: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
    take: 3,
  })
}
