'use server'

import { appConfig } from '@/config/app'
import { env } from '@/env.mjs'
import { getUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { getSymbols } from '@/lib/fmp/get-symbols'
import { logger } from '@/lib/logger'
import { UploadStocksProps, UploadStocksSchema } from '@/lib/validators/stock'
import { StockPeer } from '@/types/stock'
import { Stock } from '@prisma/client'
import { notFound } from 'next/navigation'
import pLimit from 'p-limit'
import { cleanDatabase } from './clean-database'

interface FlattenedData {
  profile: Stock
  peersList: string
}

const uploadConfig = appConfig.upload

/**
 * Uploads descriptive stock data to the database.
 * @param values `UploadStocksSchema` validator
 * @returns Status message for upload.
 */
export const uploadStocks = async (values: UploadStocksProps) => {
  const validatedFields = UploadStocksSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug('uploadStocks (invalid_data): values=%o', values)
    return { error: 'Invalid data.' }
  }

  const user = await getUser()

  if (!user) {
    logger.debug('uploadStocks (unauthorized)')
    return notFound()
  }

  if (user?.role !== 'ADMIN') {
    logger.debug('uploadStocks (forbidden) userId=%s', user.id)
    return notFound()
  }

  const { testRun } = validatedFields.data

  const startTime = Date.now()
  const symbols = testRun ? ['AAPL', 'MSFT'] : await getSymbols()
  if (!symbols?.length) {
    logger.error('uploadStocks (internal_error): error=Symbol fetch failed.')
    return { error: 'Internal server error.' }
  }

  logger.info(
    'uploadStocks (upload_initialized): symbolCount=%s',
    symbols.length
  )

  const symbolBatches = []
  for (
    let i = 0;
    i < symbols.length;
    i += Number(uploadConfig.symbolsPerFetch)
  ) {
    symbolBatches.push(
      symbols.slice(i, i + Number(uploadConfig.symbolsPerFetch))
    )
  }

  const fetchPromises = symbolBatches.map(async (batch, i) => {
    const symbolsBatchString = batch.join(',')
    const [profileResponse, stockPeerResponse] = await Promise.all([
      fetch(
        `${appConfig.fmp.url}v3/profile/${symbolsBatchString}?apikey=${env.FMP_API_KEY}`,
        { cache: 'no-store' }
      ),
      fetch(
        `${appConfig.fmp.url}v4/stock_peers?symbol=${symbolsBatchString}&apikey=${env.FMP_API_KEY}`,
        { cache: 'no-store' }
      ),
    ])

    if (!profileResponse.ok || !stockPeerResponse.ok) {
      logger.error('uploadStocks (fetch_failed): symbolBatchNr=%s', i)
      return []
    }

    const profileData: Stock[] = await profileResponse.json()
    const stockPeerData: StockPeer[] = await stockPeerResponse.json()

    return profileData.map((profile) => ({
      profile,
      peersList:
        stockPeerData
          .find((peer) => peer.symbol === profile.symbol)
          ?.peersList?.join(',') ?? '',
    }))
  })

  const fetchedData = await Promise.all(fetchPromises)
  const fetchEnd = Date.now() - startTime
  logger.info(
    `uploadStocks (fetch_done): time=%ss`,
    (fetchEnd / 1000).toFixed(0)
  )

  const flattenedData = fetchedData.flat()

  let uploadedSymbols = 0
  const limit = pLimit(uploadConfig.concurrencyLimit)

  const batchPromises = Array.from(
    { length: Math.ceil(flattenedData.length / uploadConfig.batchSize) },
    (_, i) => {
      const batchStart = i * uploadConfig.batchSize
      const batchEnd = Math.min(
        batchStart + uploadConfig.batchSize,
        flattenedData.length
      )
      const batch = flattenedData.slice(batchStart, batchEnd)

      return limit(async () => {
        const successfulUploads = await executeTransaction(batch)
        uploadedSymbols += successfulUploads
        if (
          uploadedSymbols % uploadConfig.mileStone === 0 &&
          uploadedSymbols !== 0
        ) {
          const percentage = Math.round(
            (uploadedSymbols / symbols.length) * 100
          ).toFixed(0)
          const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(0)
          logger.info(
            `uploadStocks (batch_done): status=${percentage}%, time=${elapsedTime}s`
          )
        }
      })
    }
  )

  await Promise.all(batchPromises)
  await cleanDatabase()

  const end = Date.now() - startTime
  logger.info(
    `uploadStocks (done): uploadedSymbols=%s, time=%ss.`,
    uploadedSymbols,
    (end / 1000).toFixed(0)
  )

  return { success: 'Stock upload complete.' }
}

const executeTransaction = async (batch: FlattenedData[]) => {
  const upsertQueries = batch.map(({ profile, peersList }) => {
    const newStock = {
      ...profile,
      peersList,
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
    return db.stock.upsert({
      select: { id: true },
      where: { symbol: profile.symbol },
      update: newStock,
      create: newStock,
    })
  })

  try {
    const results = await db.$transaction(upsertQueries)
    return results?.length ?? 0
  } catch (err) {
    if (err instanceof Error) {
      logger.error('uploadStocks (transaction_error): error=%s', err.message)
    }
    return 0
  }
}
