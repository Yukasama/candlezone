import { db } from '@/lib/db'
import { env } from '@/env.mjs'
import { isSymbolValid } from '@/utils/stock-helper'
import { logger } from '@/lib/logger'
import { appConfig } from '@/config/app'
import { Financials, Stock } from '@prisma/client'

/**
 * Fetches stock data from the Financial Modeling Prep API and adds it to the database.
 * @param symbol Symbol to return and add to the database.
 * @returns Stock object from the database or undefined.
 */
export const getStockRatios = async ({ symbol }: { symbol: string }) => {
  if (!isSymbolValid(symbol)) {
    return
  }

  const stockDb = await db.stock.findFirst({
    include: { financials: true },
    where: { symbol: symbol.toUpperCase() },
  })

  if (!stockDb) {
    return
  }

  const twoHoursAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30)
  if (
    stockDb.updatedAt > twoHoursAgo &&
    stockDb.financials.length &&
    stockDb.peRatioTTM
  ) {
    return stockDb
  }

  const errorMsg = 'Error Message'
  type TempStock = Partial<Stock> & { 'Error Message': string }

  const entries = !stockDb.financials.length ? 120 : 1
  const [ratiosTTM, ratios]: [TempStock[], Financials[]] = await Promise.all([
    fetch(
      `${appConfig.fmp.url}v3/ratios-ttm/${symbol}?apikey=${env.FMP_API_KEY}`,
      { cache: 'no-cache' }
    ).then((res) => res.json()),
    fetch(
      `${appConfig.fmp.url}v3/ratios/${symbol}?limit=${entries}&apikey=${env.FMP_API_KEY}`,
      { cache: 'no-cache' }
    ).then((res) => res.json()),
  ])

  const stock = {
    symbol,
    companyName: stockDb.companyName,
    image: stockDb.image,
    ...ratiosTTM[0],
    errorMessage: ratiosTTM[0][errorMsg],
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

  const stockUpsert = db.stock.upsert({
    where: { symbol: symbol.toUpperCase() },
    update: stock,
    create: stock,
  })

  const linkedFinancials = ratios.map((financial: any) => ({
    ...financial,
    stockId: stockDb.id,
    errorMessage: financial[errorMsg] ?? null,
    priceToBookRatio: undefined,
    acceptedDate: undefined,
    link: undefined,
    finalLink: undefined,
  }))

  const financialInserts =
    entries === 1
      ? db.financials.upsert({
          where: {
            stockId_calendarYear: {
              stockId: stockDb.id,
              calendarYear: linkedFinancials[0].calendarYear,
            },
          },
          update: linkedFinancials[0],
          create: linkedFinancials[0],
        })
      : db.financials.createMany({
          data: linkedFinancials,
        })

  const upsert = await db.$transaction([stockUpsert, financialInserts])
  logger.info('getStockRatios (data_refresh): symbol=%s', upsert[0].symbol)

  return {
    ...upsert[0],
    financials: linkedFinancials,
  }
}
