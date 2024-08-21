import { appConfig } from '@/config/app'
import { env } from '@/env.mjs'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { PortfolioHistoryProps } from '@/lib/validators/portfolio'
import { DailyHistory } from '@/types/stock'
import { uniq } from 'lodash'

export const calcPortfolioHistory = async (values: PortfolioHistoryProps) => {
  const { portfolioId } = values

  const stocksInPortfolio = await db.portfolioOrder.findMany({
    select: {
      date: true,
      createdAt: true,
      price: true,
      type: true,
      quantity: true,
      stock: {
        select: { symbol: true },
      },
    },
    where: { portfolioId, deleted: false },
    orderBy: { date: 'asc' },
  })

  if (!stocksInPortfolio.length) {
    return []
  }

  const symbols = uniq(
    stocksInPortfolio.map((order) => order.stock.symbol),
  ).join(',')

  const response = await fetch(
    `${appConfig.fmp.url}v3/historical-price-full/${symbols}?apikey=${env.FMP_API_KEY}`,
  )

  if (!response.ok) {
    logger.error(
      'calcPortfolioHistory (error): Fetch failed, status: %s',
      response.status,
    )
    throw new Error('Failed to fetch historical data.')
  }

  const data = await response.json()

  let stockDataList: DailyHistory[] = []

  if (data.historicalStockList) {
    stockDataList = data.historicalStockList
  } else if (data.historical) {
    stockDataList = [{ symbol: symbols, historical: data.historical }]
  } else {
    logger.error('calcPortfolioHistory (error): Invalid data structure.')
    throw new Error('Invalid data structure.')
  }

  const result: Record<
    string,
    { date: string; return: number; realizedPL: number }
  > = {}

  const stockOrderMap = new Map<string, typeof stocksInPortfolio>()

  stocksInPortfolio.forEach((order) => {
    if (!stockOrderMap.has(order.stock.symbol)) {
      stockOrderMap.set(order.stock.symbol, [])
    }
    stockOrderMap.get(order.stock.symbol)!.push(order)
  })

  const getPreviousHistoricalDate = (historical: any[], targetDate: string) => {
    const target = new Date(targetDate)
    for (let i = 1; i <= 5; i++) {
      // iterate backwards up to 5 days
      const previousDate = new Date(target)
      previousDate.setDate(previousDate.getDate() - i)
      const previousDateString = previousDate.toISOString().split('T')[0]
      const entry = historical.find((h) => h.date === previousDateString)
      if (entry) {
        return entry
      }
    }
    return null // should not happen within 5 days
  }

  const processHistoricalData = (historical: any[], symbol: string) => {
    const orders = stockOrderMap.get(symbol) ?? []
    let currentQuantity = 0
    let currentTotalCost = 0
    const realizedPL = 0

    const dateOrderMap = new Map<
      string,
      { quantity: number; totalCost: number }
    >()

    orders.forEach((order) => {
      const orderDateStr = order.date.toISOString().split('T')[0]
      if (!dateOrderMap.has(orderDateStr)) {
        dateOrderMap.set(orderDateStr, { quantity: 0, totalCost: 0 })
      }
      const dateEntry = dateOrderMap.get(orderDateStr)!
      dateEntry.quantity += order.quantity
      dateEntry.totalCost += order.quantity * order.price
    })

    dateOrderMap.forEach((orderInfo, orderDateStr) => {
      const previousEntry = getPreviousHistoricalDate(historical, orderDateStr)

      if (previousEntry) {
        currentQuantity += orderInfo.quantity
        currentTotalCost += orderInfo.totalCost

        const unrealizedPL =
          currentQuantity * previousEntry.close - currentTotalCost
        const totalReturn = unrealizedPL + realizedPL

        if (!result[previousEntry.date]) {
          result[previousEntry.date] = {
            date: previousEntry.date,
            return: 0,
            realizedPL: 0,
          }
        }
        result[previousEntry.date].return += totalReturn
        result[previousEntry.date].realizedPL += realizedPL

        logger.debug(
          'Processed date %s for symbol %s: currentQuantity=%d, return=%d, realizedPL=%d',
          previousEntry.date,
          symbol,
          currentQuantity,
          totalReturn,
          realizedPL,
        )
      }
    })
  }

  stockDataList.forEach((stockData) => {
    const symbol = stockData.symbol
    processHistoricalData(stockData.historical, symbol)
  })

  const history = Object.keys(result)
    .sort()
    .map((date) => ({
      date,
      return: result[date].return,
      realizedPL: result[date].realizedPL,
    }))
    .filter((entry) => entry.return !== 0 || entry.realizedPL !== 0)

  logger.info(
    'calcPortfolioHistory (done): portfolioId=%s history=%o',
    portfolioId,
    history,
  )

  return history
}
