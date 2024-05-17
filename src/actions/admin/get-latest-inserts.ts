'use server'

import { db } from '@/lib/db'

/**
 * Fetches the latest stock inserts to the database
 * @returns Latest 6 stock inserts
 */
export async function getLatestInserts() {
  return await db.stock.findMany({
    select: {
      symbol: true,
      companyName: true,
      image: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
    take: 6,
  })
}
