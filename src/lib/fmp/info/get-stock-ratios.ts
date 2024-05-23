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
  const [ratiosTTM, ratios] = await Promise.all([
    fetch(
      `${appConfig.fmp.url}v3/ratios-ttm/${symbol}?apikey=${env.FMP_API_KEY}`,
      { cache: 'no-cache' }
    ),
    fetch(
      `${appConfig.fmp.url}v3/ratios/${symbol}?limit=${entries}&apikey=${env.FMP_API_KEY}`,
      { cache: 'no-cache' }
    ),
  ])

  if (!ratiosTTM.ok || !ratios.ok) {
    logger.info('getStockRatios (fetch_failed): symbol=%s', stockDb.symbol)
    return stockDb
  }

  const ratiosTTMData: TempStock[] = await ratiosTTM.json()
  const ratiosData: Financials[] = await ratios.json()

  const stock = {
    symbol,
    companyName: stockDb.companyName,
    image: stockDb.image,
    ...ratiosTTMData[0],
    errorMessage: ratiosTTMData[0][errorMsg],
    price: undefined,
    volAvg: undefined,
    lastDiv: undefined,
    changes: undefined,
    phone: undefined,
    ipoDate: undefined,
    defaultImage: undefined,
    isAdr: undefined,
    priceBookValueRatioTTM: undefined,
    priceToOperatingCashFlowsRatioTTM: undefined,
    priceSalesRatioTTM: undefined,
    priceFairValueTTM: undefined,
    targetHigh: undefined,
    targetLow: undefined,
    targetConsensus: undefined,
    targetMedian: undefined,
  }

  const ratiosTTMUpsert = db.stock.upsert({
    where: { symbol: symbol.toUpperCase() },
    update: stock,
    create: stock,
  })

  const ratiosUpsert = ratiosData.map((financial: any) => ({
    ...financial,
    stockId: stockDb.id,
    errorMessage: financial[errorMsg] ?? null,
    priceBookValueRatio: undefined,
    priceToOperatingCashFlowsRatio: undefined,
    priceSalesRatio: undefined,
    priceFairValue: undefined,
  }))

  const financialInserts =
    entries === 1
      ? db.financials.upsert({
          where: {
            stockId_calendarYear: {
              stockId: stockDb.id,
              calendarYear: ratiosUpsert[0].calendarYear,
            },
          },
          update: ratiosUpsert[0],
          create: ratiosUpsert[0],
        })
      : db.financials.createMany({
          data: ratiosUpsert,
        })

  const upsert = await db.$transaction([ratiosTTMUpsert, financialInserts])
  logger.info('getStockRatios (data_refresh): symbol=%s', upsert[0].symbol)

  return {
    ...upsert[0],
    financials: ratiosUpsert,
  }
}
