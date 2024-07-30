import { appConfig } from '@/config/app'
import { env } from '@/env.mjs'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import 'server-only'

export const calcPortfolioHistory = async (
  portfolioId: string,
  timeframe: string,
) => {
  const stocksInPortfolio = await db.stockInPortfolio.findMany({
    select: {
      createdAt: true,
      quantity: true,
      stock: {
        select: { symbol: true },
      },
    },
    where: { portfolioId },
  })

  logger.info('Stocks in portfolio: %o', stocksInPortfolio)

  const symbols = stocksInPortfolio.map((stock) => stock.stock.symbol).join(',')

  const response = await fetch(
    `${appConfig.fmp.url}v3/historical-price-full/${symbols}?apikey=${env.FMP_API_KEY}`,
  )

  if (!response.ok) {
    throw new Error('Failed to fetch historical data')
  }

  const data = await response.json()

  logger.info('Fetched historical data: %o', data)

  const result: any = {}

  const processHistoricalData = (
    symbol: string,
    historical: any[],
    createdAt: Date,
    quantity: number,
  ) => {
    const stockAddedDate = new Date(createdAt)
    logger.debug(
      'Stock added date: %s (timestamp: %d)',
      stockAddedDate.toISOString(),
      stockAddedDate.getTime(),
    )

    historical.forEach((entry: any) => {
      const entryDate = new Date(entry.date)

      logger.debug(
        'Entry date: %s (timestamp: %d)',
        entryDate.toISOString(),
        entryDate.getTime(),
      )
      logger.debug(
        'Comparing dates: entryDate >= stockAddedDate: %s >= %s',
        entryDate.toISOString(),
        stockAddedDate.toISOString(),
      )

      if (entryDate.getTime() >= stockAddedDate.getTime()) {
        if (!result[entry.date]) {
          result[entry.date] = {
            date: entry.date,
            totalClose: 0,
            totalQuantity: 0,
          }
        }

        logger.debug(
          'Adding to result: entryDate=%s, close=%d, quantity=%d',
          entry.date,
          entry.close,
          quantity,
        )

        result[entry.date].totalClose += entry.close * quantity
        result[entry.date].totalQuantity += quantity
      } else {
        logger.debug(
          'Skipping entry: entryDate=%s, stockAddedDate=%s',
          entry.date,
          stockAddedDate.toISOString(),
        )
      }
    })
  }

  if (Array.isArray(data.historicalStockList)) {
    data.historicalStockList.forEach((stockData: any) => {
      const symbol = stockData.symbol
      const stockInfo = stocksInPortfolio.find(
        (stock) => stock.stock.symbol === symbol,
      )

      logger.debug(
        'Processing stockData from historicalStockList: symbol=%s, stockInfo=%o',
        symbol,
        stockInfo,
      )

      if (stockInfo) {
        processHistoricalData(
          symbol,
          stockData.historical,
          stockInfo.createdAt,
          stockInfo.quantity,
        )
      }
    })
  } else {
    const symbol = data.symbol
    const stockInfo = stocksInPortfolio.find(
      (stock) => stock.stock.symbol === symbol,
    )

    logger.debug(
      'Processing single stockData: symbol=%s, stockInfo=%o',
      symbol,
      stockInfo,
    )

    if (stockInfo) {
      processHistoricalData(
        symbol,
        data.historical,
        stockInfo.createdAt,
        stockInfo.quantity,
      )
    }
  }

  logger.info('Result after processing all data: %o', result)

  const finalData = Object.values(result)
    .filter((entry: any) => entry.totalQuantity > 0)
    .map((entry: any) => {
      return {
        date: entry.date,
        close: entry.totalClose / entry.totalQuantity,
      }
    })

  logger.info('calcPortfolioHistory (done): finalData=%o', finalData)
  return finalData
}
