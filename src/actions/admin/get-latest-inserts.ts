'use server'

import { db } from '@/lib/db'

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
