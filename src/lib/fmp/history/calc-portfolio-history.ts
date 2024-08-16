import { appConfig } from '@/config/app'
import { env } from '@/env.mjs'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { PortfolioHistoryProps } from '@/lib/validators/portfolio'
import 'server-only'

export const calcPortfolioHistory = async (values: PortfolioHistoryProps) => {
  const { portfolioId, options } = values

  const stocksInPortfolio = await db.portfolioOrder.findMany({
    select: {
      createdAt: true,
      price: true,
      quantity: true,
      stock: {
        select: { symbol: true },
      },
    },
    where: { portfolioId },
  })

  if (!stocksInPortfolio.length) {
    return []
  }

  const symbols = stocksInPortfolio.map((stock) => stock.stock.symbol).join(',')

  const response = await fetch(
    `${appConfig.fmp.url}v3/historical-price-full/${symbols}?apikey=${env.FMP_API_KEY}`,
  )

  if (!response.ok) {
    logger.error(
      'calcPortfolioHistory: Failed to fetch historical data, status: %s',
      response.status,
    )
    throw new Error('Failed to fetch historical data')
  }

  const data = await response.json()

  const result: any = {}

  const processHistoricalData = (
    historical: any[],
    createdAt: Date,
    quantity: number,
    buyPrice: number,
  ) => {
    const stockAddedDate = new Date(createdAt)
    const filteredHistorical = historical.filter((entry: any) => {
      const entryDate = new Date(entry.date)
      return entryDate >= stockAddedDate
    })

    if (filteredHistorical.length === 0) {
      const lastEntry = historical.find(
        (entry: any) => new Date(entry.date) <= stockAddedDate,
      )
      if (lastEntry) {
        filteredHistorical.push(lastEntry)
      }
    }

    filteredHistorical.forEach((entry: any) => {
      const entryDate = entry.date
      if (!result[entryDate]) {
        result[entryDate] = {
          date: entryDate,
          totalChange: 0,
          totalQuantity: 0,
        }
      }

      const change = ((entry.close - buyPrice) / buyPrice) * 100
      result[entryDate].totalChange += options?.excludeQuantity
        ? change
        : change * quantity
      result[entryDate].totalQuantity += options?.excludeQuantity ? 1 : quantity
    })
  }

  const stockDataList = Array.isArray(data.historicalStockList)
    ? data.historicalStockList
    : [data]

  stockDataList.forEach((stockData: any) => {
    const symbol = stockData.symbol
    const stockInfo = stocksInPortfolio.find(
      (stock) => stock.stock.symbol === symbol,
    )

    if (stockInfo) {
      processHistoricalData(
        stockData.historical,
        stockInfo.createdAt,
        stockInfo.quantity,
        stockInfo.price,
      )
    } else {
      logger.warn(
        'calcPortfolioHistory (not_found): No stockInfo found for symbol: %s',
        symbol,
      )
    }
  })

  const history = Object.values(result)
    .map((entry: any) => {
      return {
        date: entry.date,
        change: entry.totalChange / entry.totalQuantity,
      }
    })
    .reverse()

  logger.info(
    'calcPortfolioHistory (done): portfolioId=%s history=%o',
    portfolioId,
    history,
  )
  return history
}
