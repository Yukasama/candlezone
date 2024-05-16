'use server'

import { db } from '@/lib/db'
import { FMP, FMP_API_URL } from '@/config/fmp/config'
import { env } from '@/env.mjs'
import { getUser } from '@/lib/auth'
import { Stock } from '@prisma/client'
import { getSymbols } from '@/lib/fmp/get-symbols'
import { logger } from '@/lib/logger'
import { notFound } from 'next/navigation'

/**
 * Uploads descriptive stock data to the database.
 * @returns Status message for upload.
 */
export const uploadStocks = async () => {
  const user = await getUser()

  if (!user) {
    logger.debug('uploadStocks (unauthorized)')
    return notFound()
  }

  if (user?.role !== 'ADMIN') {
    logger.debug('uploadStocks (forbidden)')
    return notFound()
  }

  const start = Date.now()
  const symbols = await getSymbols()
  if (!symbols?.length) {
    logger.error('uploadStocks (internal_error): error=Symbol fetch failed.')
    return { error: 'Internal server error.' }
  }

  logger.info(
    'uploadStocks (upload_initialized): symbolCount=%s',
    symbols.length
  )

  // Splitting symbols into batches with length of FMP.docsPerPull
  const symbolBatches = []
  for (let i = 0; i < symbols.length; i += Number(FMP.docsPerPull)) {
    symbolBatches.push(symbols.slice(i, i + Number(FMP.docsPerPull)))
  }

  let uploadedSymbols = 0
  await Promise.all(
    symbolBatches.map(async (symbolsBatch) => {
      try {
        const symbolsBatchString = symbolsBatch.join(',')
        const [profileData, stockPeerData] = await Promise.all([
          fetch(
            `${FMP_API_URL}v3/profile/${symbolsBatchString}?apikey=${env.FMP_API_KEY}`,
            { cache: 'no-cache' }
          ).then((res) => res.json()),
          fetch(
            `${FMP_API_URL}v4/stock_peers?symbol=${symbolsBatchString}&apikey=${env.FMP_API_KEY}`,
            { cache: 'no-cache' }
          ).then((res) => res.json()),
        ])

        if (!profileData) {
          logger.error(
            'uploadStocks (internal_error): error=Failed to fetch profile or stock peer data.'
          )
          return { error: 'Internal server error.' }
        }

        const upserts = profileData
          .map((data: Stock) => {
            try {
              const newStock = {
                ...data,
                peersList:
                  stockPeerData
                    .find((p: any) => p.symbol === data.symbol)
                    ?.peersList?.join(',') ?? '',
                price: undefined,
                volAvg: undefined,
                lastDiv: undefined,
                changes: undefined,
                phone: undefined,
                ipoDate: undefined,
                defaultImage: undefined,
                isAdr: undefined,
                targetHigh: undefined,
                targetLow: undefined,
                targetConsensus: undefined,
                targetMedian: undefined,
              }

              if (!newStock.companyName) {
                return
              }

              return db.stock.upsert({
                select: {
                  id: true,
                  symbol: true,
                  financials: true,
                },
                where: { symbol: data.symbol },
                update: newStock,
                create: newStock,
              })
            } catch (err: any) {
              logger.error(
                'uploadStocks (fetch_failed): error=Data preparation for symbol=%s failed.',
                data.symbol
              )
            }
          })
          .filter(Boolean)

        try {
          const results = await db.$transaction(upserts)
          uploadedSymbols += results.length
        } catch (err) {
          if (err instanceof Error) {
            logger.error(
              'uploadStocks (database_error): symbolBatch=%s, error=%s',
              symbolsBatch[0],
              err.message
            )
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          logger.error(
            'uploadStocks (internal_error): symbolBatch=%s, error=%s',
            symbolsBatch[0],
            err.message
          )
        }
      }
    })
  ).then(async () => {
    // Clean up faulty stock entries
    const deleted = await db.stock.deleteMany({
      where: { errorMessage: { not: null } },
    })

    logger.info(
      'uploadStocks (database_cleared): deletedStocks=%s',
      deleted.count
    )
  })

  const end = Date.now() - start
  logger.info(
    `uploadStocks: uploadedStocks=%s, time=%ss.`,
    uploadedSymbols,
    (end / 1000).toFixed(0)
  )

  return { success: 'Stock upload complete.' }
}
